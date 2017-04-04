/* global Vue app user _ */

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
         * Add an error for this component
         * @param  {object} error Error object
         */
        addError: function(error)
        {
            this.errors.push(error)
        },
        /**
         * Remove all errors
         */
        cleanErrors: function()
        {
            this.errors.length = 0
        },
        /**
         * Signin with email form
         */
        loginWithEmail: function()
        {
            this.cleanErrors()

            user.loginWithEmail(this.signin.email, this.signin.password)
            .then(function()
            {
                _.cleanObject(this.signin)
            }.bind(this))
            .catch(this.addError)
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
            this.cleanErrors()

            user.registerWithEmail()
            .catch(this.addError)
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
