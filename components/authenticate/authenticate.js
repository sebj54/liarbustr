Vue.component('authenticate', app.resolveTemplate('authenticate', {

    data: function() {

        return {
            provider: null,
        }
    },

    methods: {
        loginFacebook: function()
        {
            user.loginFacebook()
        },

        loginTwitter: function()
        {
            user.loginTwitter()
        },

        loginGoogle: function()
        {
            user.loginGoogle()
        },
    }
}))
