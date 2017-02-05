var fieldId = function(name)
{
    return name + '-' + this._uid
}

Vue.component('lie-form', app.resolveTemplate('lie-form', {
    data: function()
    {
        return {
            lie: fakeDatas.lieEmptyStructure()
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
        fieldId: fieldId,
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
