/* global app user */

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
    meta:
    [
        {
            name: 'og:title',
            content: 'LiarBustr',
        },
    ],
    /**
     * Add a route with lazy loading
     * @param {string} route Route URL (e.g. 'home')
     * @param {string|null} path View filename (optional, default: /{route})
     * @return {object} router, for chaining purpose
     */
    add: function(route, path)
    {
        const absoluteRoute = '/' + route
        const absolutePath = (!path) ? absoluteRoute : path

        this.routes.push({
            path: absoluteRoute,
            component: function(resolve, reject)
            {
                app.get('views' + absolutePath + absolutePath + '.html', function(template)
                {
                    resolve({
                        data: function()
                        {
                            return {
                                user: user,
                            }
                        },
                        template: template,
                        metaInfo: {
                            meta: router.meta,
                        },
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
.add('lie-form')
