/* global firebase app _ */

/**
 * User object
 * @type {Object}
 */
const user = {
    /**
     * User email
     * @type {string}
     */
    email: null,
    /**
     * User is an admin if true
     * @type {Boolean}
     */
    isAdmin: true,
    /**
     * User is not actually logged in if true
     * @type {Boolean}
     */
    isAnonymous: true,
    /**
     * User full name
     * @type {string}
     */
    name: null,
    /**
     * User profile picture (path)
     * @type {string}
     */
    profilePicture: null,
    /**
     * User login source
     * @type {string}
     */
    source: null,
    /**
     * User UUID
     * @type {string}
     */
    uid: null,
    /**
     * Signup properties
     * @type {Object}
     */
    signup: {},

    /**
     * Init function
     * @return {Promise<object>} A promise to the logged in user (even anonymously)
     */
    init: function()
    {
        return new Promise(function(resolve, reject)
        {
            let isInit = true

            firebase.auth().onAuthStateChanged(function(firebaseUser)
            {
                if (firebaseUser)
                {
                    user.fetch(firebaseUser)
                    .then(function(fetchedUser)
                    {
                        if (isInit)
                        {
                            isInit = false
                            resolve(fetchedUser)
                        }

                        user.updateFromFirebaseUser(fetchedUser)
                    })
                }
                else
                {
                    firebase.auth().signInAnonymously()
                    .then(function()
                    {
                        if (isInit)
                        {
                            isInit = false
                            resolve(user)
                        }
                    })
                    .catch(user.handleError)
                }
            })
        })
    },

    /**
     * Fetch user object from user datas
     * @param  {object|null} userData User datas - if null or empty object, user will be emptied
     * @return {Promise<object>} A promise to the fetched user
     */
    fetch: function(userData, callback)
    {
        return new Promise(function(resolve, reject)
        {
            let providerData

            if (_.isObject(userData))
            {
                providerData = userData.providerData[0]
                user.isAnonymous = _.getPropValue(userData, 'isAnonymous')
            }
            else
            {
                providerData = {}
                user.isAnonymous = true
            }

            user.source = _.getPropValue(providerData, 'providerId')

            if (user.source === 'password')
            {
                user.uid = _.getPropValue(userData, 'uid')
                user.name = _.getPropValue(providerData, 'displayName') || user.signup.name
                user.profilePicture = ''
                user.email = _.getPropValue(providerData, 'email')

                if (user.signup.name)
                {
                    userData.updateProfile({
                        displayName: user.signup.name,
                    })
                }
                _.cleanObject(user.signup)
            }
            else
            {
                user.uid = _.getPropValue(userData, 'uid')
                user.name = _.getPropValue(providerData, 'displayName')
                user.profilePicture = _.getPropValue(providerData, 'photoURL')
                user.email = _.getPropValue(providerData, 'email')
            }

            app.db.ref('/users/' + user.uid + '/isAdmin').once('value')
            .then(function(snapshot)
            {
                user.isAdmin = Boolean(snapshot.val())

                resolve(user)
            })
        })
    },

    /**
     * Handle error: useful for error callbacks
     * @param  {*} error Error passed to the callback
     */
    handleError: function(...args)
    {
        console.error(...args)
    },

    /**
     * Login with an external service
     * @param  {FacebookAuthProvider|TwitterAuthProvider|GoogleAuthProvider} provider Firebase provider
     */
    loginWith: function(provider)
    {
        const anonUser = firebase.auth().currentUser

        anonUser.linkWithPopup(provider)
        .then(function(result)
        {
        })
        .catch(function(error)
        {
            if (error.code === 'auth/credential-already-in-use' && _.hasProp(error, 'credential'))
            {
                // Merge anonymous user's data and existing user's data
                app.db.ref('/users/' + anonUser.uid + '/votes').once('value')
                .then(function(anonVotesSnapshot)
                {
                    const anonVotes = anonVotesSnapshot.val()

                    app.db.ref('/users/' + anonUser.uid).remove()
                    .then(function()
                    {
                        firebase.auth().signInWithCredential(error.credential)
                        .then(function(firebaseUser)
                        {
                            if (_.isObject(anonVotes) && !_.isEmptyObject(anonVotes))
                            {
                                app.db.ref('/users/' + firebaseUser.uid + '/votes').once('value')
                                .then(function(userVotesSnapshot)
                                {
                                    const userVotes = userVotesSnapshot.val()

                                    Object.keys(anonVotes).forEach(function(lieUid)
                                    {
                                        const updates = {}
                                        const lieVotePath = '/lies/' + lieUid + '/votes/' + userVotes[lieUid]

                                        updates['/users/' + firebaseUser.uid + '/votes/' + lieUid] = anonVotes[lieUid]

                                        app.db.ref(lieVotePath).once('value')
                                        .then(function(lieVoteSnapshot)
                                        {
                                            updates[lieVotePath] = lieVoteSnapshot.val() - 1
                                            app.db.ref().update(updates)
                                        })
                                        .catch(function()
                                        {
                                            app.db.ref().update(updates)
                                        })
                                    })
                                })
                                .catch(user.handleError)
                            }
                        })
                        .catch(user.handleError)
                    })
                })
                .catch(function()
                {
                    app.db.ref('/users/' + anonUser.uid).remove()
                })
            }
            else
            {
                user.handleError(error)
            }
        })
    },

    /**
     * Login with an e-mail and a password
     * @param  {string} email E-mail address
     * @param  {string} password Password
     * @return {Promise<object>} A promise to the logged in user
     */
    loginWithEmail: function(email, password)
    {
        return new Promise(function(resolve, reject)
        {
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function()
            {
                resolve()
            })
            .catch(function(error)
            {
                reject(app.getError(error.code))
            })
        })
    },

    /**
     * Login with Facebook
     */
    loginWithFacebook: function()
    {
        user.loginWith(new firebase.auth.FacebookAuthProvider())
    },

    /**
     * Login with Google
     */
    loginWithGoogle: function()
    {
        user.loginWith(new firebase.auth.GoogleAuthProvider())
    },

    /**
     * Login with Twitter
     */
    loginWithTwitter: function()
    {
        user.loginWith(new firebase.auth.TwitterAuthProvider())
    },

    /**
     * Log out
     */
    logout: function()
    {
        firebase.auth().signOut()
        .then(function()
        {
            app.router.push('/')
        })
        .catch(user.handleError)
    },

    /**
     * Sign up with an e-mail address
     * @return {Promise<object>} A promise to the registered user
     */
    registerWithEmail: function()
    {
        return new Promise(function(resolve, reject)
        {
            const credential = firebase.auth.EmailAuthProvider.credential(user.signup.email, user.signup.password)

            firebase.auth().currentUser.link(credential)
            .then(function(firebaseUser)
            {
                user.fetch(firebaseUser)
                .then(function(fetchedUser)
                {
                    resolve(fetchedUser)
                    user.updateFromFirebaseUser(fetchedUser)
                })
            },
            function(error)
            {
                reject(app.getError(error.code))
            })
        })
    },

    /**
     * Update Database User from Firebase User
     * @param  {firebase.User} firebaseUser Firebase User
     */
    updateFromFirebaseUser: function(firebaseUser)
    {
        const updates = {}
        updates['/users/' + firebaseUser.uid + '/lastLogin'] = Date.now()

        app.db.ref('/users/' + firebaseUser.uid).once('value')
        .then(function(snapshot)
        {
            const userSnapshot = snapshot.val()
            const keys = [
                'email',
                'isAnonymous',
                'name',
                'profilePicture',
                'uid',
            ]

            keys.forEach(function(key)
            {
                if (!_.hasProp(userSnapshot, key) || userSnapshot[key] !== firebaseUser[key])
                {
                    updates['/users/' + firebaseUser.uid + '/' + key] = firebaseUser[key]
                }
            })

            app.db.ref().update(updates)
        })
    },
}
