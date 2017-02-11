/**
 * Lie form component
 * @type {VueComponent}
 */
Vue.component('lie-form', app.resolveTemplate('lie-form', {
    data: function()
    {
        return {
            /**
             * Lie
             * @type {object}
             */
            lie: fakeDatas.lieEmptyStructure()
        }
    },
    methods: {
        /**
         * Add a source
         * @param {string} type Source type
         */
        addSource: function(type)
        {
            this.lie.sources[type].push('')
        },
        /**
         * Add a source for the statement
         */
        addStatement: function()
        {
            this.addSource('statements')
        },
        /**
         * Get field ID (html attribute)
         * @param  {string} name Field name
         * @return {string} Field name + unique identifier
         */
        fieldId: function(name)
        {
            return name + '-' + this._uid
        },
        /**
         * Save a lie
         */
        saveLie: function()
        {
            fakeDatas.lies.push(this.lie)

            this.lie = fakeDatas.lieEmptyStructure()
            setTimeout(this.addStatement) // setTimeout is mandatory for rendering to avoid not cleared source input
        }
    },
    created: function()
    {
        this.addStatement()
    }
}))
