/* global Vue app */

/**
 * SVG icon component
 * @type {VueComponent}
 */
Vue.component('alert', app.resolveTemplate('alert', {
    props: [
        'message',
        'type',
    ],
}))
