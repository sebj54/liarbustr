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
            metaInfo.title = this.$t('views.liesList.title')
            metaInfo.meta = [
                {
                    vmid: 'description',
                    name: 'description',
                    content: this.$t('views.liesList.description'),
                },
            ]
        }

        return metaInfo
    },
    firebase: function()
    {
        return {
            collection: {
                source: app.db.ref('/collections/9cc5406a-446d-4831-b821-b473485ed865'),
                asObject: true,
            },
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
            return (this.collection.lies) ? this.collection.lies.length : 0
        },
    },
}))
