/* global Vue app user */

Vue.component('app-header', app.resolveTemplate('app-header', {
    data: function()
    {
        return {
            user: user,
        }
    },
    computed: {
        isAnonymous: function()
        {
            return user.isAnonymous
        },
    },
    methods: {
        logout: user.logout,
    },
}))
