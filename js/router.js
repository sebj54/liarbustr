/* global app user document _ */

/**
 * Router - Contain routes and routes-related properties and methods
 * @type {Object}
 */
const router = {
    /**
     * Available routes
     * @type {Array}
     */
    routes: [],
    /**
     * Meta information (used by vue-meta)
     * @type {Object}
     */
    metaInfo: {
        /**
        * Meta tags
        * @type {Array}
        */
        meta:
        [
            {
                vmid: 'description',
                name: 'description',
                content: 'Report politicians lies, vote with the community and we\'ll know if they lied about corruption, tax evasion, economy, ecology, immigration, fictional employment…"',
            },
        ],
        /**
        * Page title tag
        * @type {string}
        */
        title: 'LiarBustr',
        titleTemplate: '%s | LiarBustr - Liar or not ?',
    },

    /**
     * Add a route with lazy loading
     * @param {string} route Route URL (e.g. 'home')
     * @param {string|null} path View filename (optional, default: /{route})
     * @param {object|function|null} metaInfo View meta info (optional, default: default meta infos)
     * @return {object} router, for chaining purpose
     */
    add: function(route, path, metaInfo)
    {
        const absoluteRoute = '/' + route
        const absolutePath = (!path) ? absoluteRoute : path
        const viewMetaInfo = (!metaInfo) ? {} : metaInfo

        this.routes.push({
            path: absoluteRoute,
            component: function(resolve, reject)
            {
                app.get('/views' + absolutePath + absolutePath + '.html', function(template)
                {
                    resolve({
                        data: function()
                        {
                            return {
                                user: user,
                            }
                        },
                        template: template,
                        metaInfo: viewMetaInfo,
                    })
                })
            },
        })

        // Return this for chaining
        return this
    },
}

router.add('', '/home') // Default route
.add('authenticate')
.add('lies')
.add('lie/:uid', '/lie')
.add('lie-form', null, function()
{
    return {
        title: app.vue.$t('views.lieForm.title'),
        meta: [
            {
                vmid: 'description',
                name: 'description',
                content: app.vue.$t('views.lieForm.description'),
            },
        ],
    }
})
