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
            user.loginWithEmail(this.signin)
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
            user.registerWithEmail()
        },
        /**
         * Toogle login and register forms
         */
        toggleForms: function()
        {
            this.showLoginWithEmail = !this.showLoginWithEmail
            this.showRegisterWithEmail = !this.showRegisterWithEmail
        },
    },
}))
