/**
 * User object
 * @type {Object}
 */
var user = {
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
     * Init function
     */
    init: function()
    {
        firebase.auth().onAuthStateChanged(function(firebaseUser)
        {
            if (firebaseUser)
            {
                user.fetch(firebaseUser)
            }
        })
    },

    /**
     * Get property value from an object or null if property doesn't exist
     * @param  {object|null} userData User datas - if null or empty object, user will be emptied
     */
    fetch: function(userData)
    {
        userData = (typeof userData === 'object' && userData !== null) ? userData.providerData[0] : {}

        user.uid = _.getPropValue(userData, 'uid')
        user.name = _.getPropValue(userData, 'displayName')
        user.profilePicture = _.getPropValue(userData, 'photoURL')
        user.email = _.getPropValue(userData, 'email')

        user.source = _.getPropValue(userData, 'providerId')
    },

    isLoggedIn: function()
    {
        return user.uid !== null
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

    logout: function()
    {
        firebase.auth().signOut()
        .then(function()
        {
            user.fetch()
        })
        .catch(function(error)
        {
            console.error(error)
        })
    }
}
