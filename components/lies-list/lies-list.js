/* global Vue app router */

/**
 * Lies list component
 * @type {VueComponent}
 */
Vue.component('lies-list', app.resolveTemplate('lies-list', {
    metaInfo: function()
    {
        const metaInfo = {}

        if (this.updateMeta)
        {
            metaInfo.title = 'Politician lies'
            metaInfo.meta = [
                {
                    vmid: 'description',
                    name: 'description',
                    content: 'Discover new politians lies and vote!',
                },
            ]
        }

        return metaInfo
    },
    firebase: function()
    {
        return {
            lies: app.db.ref('/lies').orderByChild('isModerated').equalTo(true),
        }
    },
    props: [
        'update-meta',
    ],
    computed: {
        /**
         * Get lies count
         * @return {integer} Lies count
         */
        count: function()
        {
            return (this.lies) ? this.lies.length : 0
        },
    },
}))
