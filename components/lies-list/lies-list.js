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
                source: app.db.ref('/collections/' + this.collectionUid),
                asObject: true,
            },
        }
    },
    props: [
        'collection-uid',
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
