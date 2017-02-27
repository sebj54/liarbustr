/* global Vue app user */

Vue.component('app-header', app.resolveTemplate('app-header', {
    data: function()
    {
        return {
            user: user,
        }
    },
    computed: {
        isLoggedIn: user.isLoggedIn,
    },
    methods: {
        logout: user.logout,
    },
}))
