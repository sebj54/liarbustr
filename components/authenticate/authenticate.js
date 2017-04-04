/* global Vue app user */

/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('authenticate', app.resolveTemplate('authenticate', {
    data: function()
    {
        return {
            errors: [],
            signup: user.signup,
            signin: {
                email: null,
                password: null,
            },
            showRegisterWithEmail: false,
            showLoginWithEmail: false,
        }
    },
    computed: {
        isAnonymous: function()
        {
            return user.isAnonymous
        },
    },
    methods: {
        /**
         * Signin with email form
         */
        loginWithEmail: function()
        {
            user.loginWithEmail(this.signin.email, this.signin.password)
            this.signin = {}
        },
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
         * Log out
         */
        logout: function()
        {
            user.logout()
        },
        /**
         * Sign up with an e-mail address
         */
        registerWithEmail: function()
        {
            this.errors.length = 0

            user.registerWithEmail()
            .catch(function(error)
            {
                this.errors.push(error)
            }.bind(this))
        },
        /**
         * Show login form
         */
        showLoginForm: function()
        {
            this.showLoginWithEmail = true
            this.showRegisterWithEmail = false
        },
        /**
         * Show register form
         */
        showRegisterForm: function()
        {
            this.showLoginWithEmail = false
            this.showRegisterWithEmail = true
        },
    },
}))
