Vue.component('lies-list', app.resolveTemplate('lies-list', {
    props: [
        'lies'
    ],
    computed: {
        count: function()
        {
            return (this.lies) ? this.lies.length : 0
        }
    }
}))
