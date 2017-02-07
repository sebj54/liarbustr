var user = {

    name: null,
    profilePicture: null,


    provider: null,

    fetchUser: function(user)
    {
        userData = user.providerData[0]

        this.uid = userData.uid
        this.name = userData.displayName
        this.profilePicture = userData.photoURL
        this.email = userData.email

        this.provider = userData.providerId

    },

    loginFacebook: function()
    {
        this.provider = new firebase.auth.FacebookAuthProvider()
        this.providerLogin()
    },

    loginTwitter: function()
    {
        this.provider = new firebase.auth.TwitterAuthProvider()
        this.providerLogin()
    },

    loginGoogle: function()
    {

        this.provider = new firebase.auth.GoogleAuthProvider()
        this.providerLogin()
    },

    providerLogin: function()
    {

        firebase.auth().signInWithPopup(this.provider).then(function(result)
        {

            var token = result.credential.accessToken
            var user = result.user

            console.log(result)

        }).catch(function(error)
        {

            var errorCode = error.code
            var errorMessage = error.message

            var email = error.email

            var credential = error.credential

            console.warn(error)
        })
    }
}
