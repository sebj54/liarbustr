/**
 * Router - Contain routes and routes-related properties and methods
 * @type {Object}
 */
var router = {
    /**
     * Available routes
     * @type {Array}
     */
    routes: [],

    /**
     * Add a route with lazy loading
     * @param {string} route Route URL (e.g. 'home')
     * @param {string|null} path View filename (optional, default: /{route})
     */
    add: function(route, path)
    {
        route = '/' + route

        if (!path)
        {
            path = route
        }

        this.routes.push({
            path: route,
            component: function(resolve, reject)
            {
                app.get('views' + path + path + '.html', function(template)
                {
                    resolve({
                        template: template
                    })
                })
            }
        })

        // Return this for chaining
        return this
    }
}
.add('', '/home') // Default route
.add('authenticate')
.add('lies')
.add('lie/:uid', '/lie')
.add('lie-form')
