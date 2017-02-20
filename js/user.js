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
                    })

                    app.db.ref().update(updates)
                })
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
            const providerData = (typeof userData === 'object' && userData !== null) ? userData.providerData[0] : {}

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
                user.uid = _.getPropValue(providerData, 'uid')
                user.name = _.getPropValue(providerData, 'displayName')
                user.profilePicture = _.getPropValue(providerData, 'photoURL')
                user.email = _.getPropValue(providerData, 'email')
            }

            resolve(user)
        })
    },

    isLoggedIn: function()
    {
        return user.uid !== null && user.uid !== undefined
    },

    /**
     * Login with Facebook
     */
    loginWithFacebook: function()
    {
        user.loginWith(new firebase.auth.FacebookAuthProvider())
    },

    /**
     * Login with Twitter
     */
    loginWithTwitter: function()
    {
        user.loginWith(new firebase.auth.TwitterAuthProvider())
    },

    /**
     * Login with Google
     */
    loginWithGoogle: function()
    {
        user.loginWith(new firebase.auth.GoogleAuthProvider())
    },

    signupWithEmail: function()
    {
        firebase.auth().createUserWithEmailAndPassword(user.signup.email, user.signup.password).then(function(response) {

        }).catch(function(error)
        {
            console.log(error)
        });
    },
    /**
     * Sign up with an e-mail address
     */
    signupWithEmail: function()
    {
        firebase.auth().createUserWithEmailAndPassword(user.signup.email, user.signup.password)
        .then(function(response)
        {
        }).catch(function(error)
        {
            console.error(error)
        })
    },

    /**
     * Login with an external service
     * @param  {FacebookAuthProvider|TwitterAuthProvider|GoogleAuthProvider} provider Firebase provider
     */
    loginWith: function(provider)
    {
        firebase.auth().signInWithPopup(provider)
        .then(function(result)
        {
        })
        .catch(function(error)
        {
            console.error(error)
        })
    },

    /**
     * Log out
     */
    logout: function()
    {
        firebase.auth().signOut()
        .then(function()
        {
            user.fetch(null)
        })
        .catch(function(error)
        {
            console.error(error)
        })
    },
}
