var router = {
    routes: [],
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
                app.get('/views' + path + path + '.html', function(template)
                {
                    resolve({
                        template: template,
                        data: function()
                        {
                            return {
                                fakeDatas: fakeDatas
                            }
                        }
                    })
                })
            }
        })

        // Return this for chaining
        return this
    }
}
.add('', '/home')
