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
    firebase: function()
    {
        return {
            lies: app.db.ref('/lies')
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
         * Get empty structure of a lie
         * @return {object} Lie
         */
        lieEmptyStructure: function()
        {
            return {
                title: '',
                liar: '',
                text: '',
                votes: {
                    liar: 1,
                    notLiar: 0
                },
                sources: {
                    statements: [],
                    refutations: [],
                    confirmations: []
                },
                pictures: {
                    main: null
                }
            }
        },
        /**
         * Save a lie
         */
        saveLie: function()
        {
            this.$firebaseRefs.lies.push(this.lie)

            this.lie = this.lieEmptyStructure()
            setTimeout(this.addStatement) // setTimeout is mandatory for rendering to avoid not cleared source input
        }
    },
    created: function()
    {
        this.addStatement()
    }
}))
