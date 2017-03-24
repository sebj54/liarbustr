/* global Vue autosize */

/**
 * Autosize Vue directive
 * Dynamically resize textareas based on their content
 * @type {VueDirective}
 */
Vue.directive('autosize', {
    inserted: function(el)
    {
        autosize(el)
    },
})
