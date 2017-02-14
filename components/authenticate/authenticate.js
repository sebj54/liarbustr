/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('authenticate', app.resolveTemplate('authenticate', {
    data: function()
    {
        return {
        }
    },
    computed: {
        isLoggedIn: user.isLoggedIn
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
         * Logout
         */
        logout: function()
        {
            user.logout()
        }
    }
}))
