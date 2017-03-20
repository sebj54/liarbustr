/* global Vue app _ */

/**
 * Lie form component
 * @type {VueComponent}
 */
Vue.component('lie-form-source', app.resolveTemplate('lie-form-source', {
    props: [
        'id',
        'number',
        'source',
    ],
}))
