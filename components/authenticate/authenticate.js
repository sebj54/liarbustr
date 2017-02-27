/* global Vue app user */

/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('authenticate', app.resolveTemplate('authenticate', {
    data: function()
    {
        return {
            signup: user.signup,
            signin: {
                email: null,
                password: null,
            },
            showSignupWithEmail: false,
            showSigninWithEmail: false,
        }
    },
    computed: {
        isLoggedIn: user.isLoggedIn,
    },
    methods: {
        /**
         * Login with Facebook
         */
        loginWithFacebook: function()
        {
            user.loginWithFacebook()
        },
        /**
         * Login with Twitter
         */
        loginWithTwitter: function()
        {
            user.loginWithTwitter()
        },
        /**
         * Login with Google
         */
        loginWithGoogle: function()
        {
            user.loginWithGoogle()
        },
        /**
         * Sign up with an e-mail address
         */
        signupEmail: function()
        {
            user.signupWithEmail()
        },
        /**
         * Signin with email form
         */
        signinEmail: function()
        {
            user.signinWithEmail(this.signin)
        },

        editDisplayName: function(name)
        {
            user.userObject.updateProfile({
                displayName: name,
            })
            user.userObject.displayName = name
        },
        /**
         * Log out
         */
        logout: function()
        {
            user.logout()
        },

        showSignupForm: function()
        {
            this.showSigninWithEmail = false
            this.showSignupWithEmail = true
        },

        showSigninForm: function()
        {
            this.showSignupWithEmail = false
            this.showSigninWithEmail = true
        },
    },
}))
