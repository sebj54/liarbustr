/* global Vue app router */

/**
 * Lies list component
 * @type {VueComponent}
 */
Vue.component('lies-list', app.resolveTemplate('lies-list', {
    data: function()
    {
        const data = {}
        router.title = 'Politicians lies'
        router.description = 'Discover new politians lies and vote!'
        return data
    },
    firebase: function()
    {
        return {
            lies: app.db.ref('/lies'),
        }
    },
    computed: {
        /**
         * Get lies count
         * @return {integer} Lies count
         */
        count: function()
        {
            return (this.lies) ? this.lies.length : 0
        },
    },
}))
