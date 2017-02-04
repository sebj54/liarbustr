var fieldId = function(name)
{
    return name + '-' + this._uid
}

Vue.component('lie-form', app.resolveTemplate('lie-form', {
    data: function()
    {
        return {
            lie: {
                title: '',
                liar: '',
                text: '',
                votes: {
                    liar: 1,
                    notLiar: 0
                },
                sources: {
                    statements: [''],
                    refutations: [],
                    confirmations: []
                },
                pictures: {
                    main: null
                }
            }
        }
    },
    methods: {
        addSource: function(type)
        {
            this.lie.sources[type].push('')
        },
        addStatement: function()
        {
            this.addSource('statements')
        },
        fieldId: fieldId
    }
}))

Vue.component('lie-form-source', app.resolveTemplate('lie-form/lie-form-source', {
    props: [
        'index',
        'placeholder',
        'type',
        'value'
    ],
    data: function()
    {
        return {
            source: null
        }
    },
    methods: {
        fieldId: fieldId
    },
    watch: {
        source: function()
        {
            this.$emit('input', this.source);
        }
    },
    created: function()
    {
        this.source = this.value
    }
}))
