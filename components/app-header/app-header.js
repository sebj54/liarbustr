/* global Vue app user */

Vue.component('app-header', app.resolveTemplate('app-header', {
    data: function()
    {
        return {
            /**
             * True if header's content is toggled
             * @type {Boolean}
             */
            isContentToggled: false,
            /**
             * User
             * @type {object}
             */
            user: user,
        }
    },
    computed: {
        /**
         * User is not actually logged in if true
         * @return {Boolean}
         */
        isAnonymous: function()
        {
            return user.isAnonymous
        },
    },
    methods: {
        /**
         * Hide header's content
         */
        hideContent: function()
        {
            this.isContentToggled = false
        },
        /**
         * Log out user
         */
        logout: user.logout,
        /**
         * Toogle header's content
         */
        toggleContent: function()
        {
            this.isContentToggled = !this.isContentToggled
        },
    },
}))
