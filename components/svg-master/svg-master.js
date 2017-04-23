/* global Vue app */

/**
 * SVG master component - Contains all symbols
 * @type {VueComponent}
 */
Vue.component('svg-master', function(resolve, reject)
{
    app.get('/svg/svg-master.svg', function(template)
    {
        resolve({
            template: template,
        })
    })
})
