/* global Vue app */

/**
 * SVG icon component
 * @type {VueComponent}
 */
Vue.component('svg-icon', app.resolveTemplate('svg-icon', {
    props: ['name'],
}))
