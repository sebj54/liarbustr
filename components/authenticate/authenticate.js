/* global Vue app user */

/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('authenticate', app.resolveTemplate('authenticate', {
    data: function()
    {
        return {
            signup: {

            }
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
        signupEmail: function()
        {
            user.signupWithEmail(this.signup.email, this.signup.password)
            user.editDisplayName(this.signup.name)
        },
        /**
         * Logout
         */
        logout: function()
        {
            user.logout()
        },
    },
}))
