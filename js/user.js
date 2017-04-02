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
     */
    init: function()
    {
        firebase.auth().onAuthStateChanged(function(firebaseUser)
        {
            if (firebaseUser)
            {
                user.fetch(firebaseUser)
                .then(function(fetchedUser)
                {
                    const updates = {}
                    updates['/users/' + fetchedUser.uid + '/lastLogin'] = Date.now()

                    app.db.ref('/users/' + fetchedUser.uid).once('value')
                    .then(function(snapshot)
                    {
                        const keys = [
                            'email',
                            'name',
                            'profilePicture',
                            'uid',
                        ]

                        keys.forEach(function(key)
                        {
                            if (!_.hasProp(snapshot, key) || snapshot[key] !== fetchedUser[key])
                            {
                                updates['/users/' + fetchedUser.uid + '/' + key] = fetchedUser[key]
                            }
                        })

                        app.db.ref().update(updates)
                    })
                })
            }
            else
            {
                firebase.auth().signInAnonymously()
                .catch(user.handleError)
            }
        })
    },

    /**
     * Get property value from an object or null if property doesn't exist
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

            resolve(user)
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
                firebase.auth().signInWithCredential(error.credential)
                .catch(user.handleError)
            }
            else
            {
                user.handleError(error)
            }
        })
    },

    loginWithEmail: function(data)
    {
        const email = data.email
        const password = data.password


        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error)
        {
            const errorCode = error.code
            const errorMessage = error.message

            user.handleError(errorCode, errorMessage)
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
            firebase.auth().signInAnonymously()
        })
        .catch(user.handleError)
    },

    /**
     * Sign up with an e-mail address
     */
    registerWithEmail: function()
    {
        firebase.auth().createUserWithEmailAndPassword(user.signup.email, user.signup.password)
        .then(function(response)
        {
        })
        .catch(user.handleError)
    },
}
