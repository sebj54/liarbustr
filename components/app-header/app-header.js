/* global Vue app user _ */

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
    firebase: function()
    {
        let firebaseDatas = null

        if (this.user.isAdmin)
        {
            firebaseDatas = {
                notModerated: {
                    source: app.db.ref('/collections/recent-unmoderated/lies'),
                    asObject: true,
                },
            }
        }

        return firebaseDatas
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
        /**
         * Count of not moderated lies
         * @return {integer} Lies count
         */
        notModeratedCount: function()
        {
            let notModeratedCount = 0

            if (_.hasProp(this, 'notModerated'))
            {
                Object.keys(this.notModerated).forEach(function(lieKey)
                {
                    if (lieKey !== '.value' && lieKey !== '.key')
                    {
                        notModeratedCount += 1
                    }
                })
            }

            return notModeratedCount
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
