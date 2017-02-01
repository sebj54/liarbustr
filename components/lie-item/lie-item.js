Vue.component('lie-item', app.resolveTemplate('lie-item', {
    data: function()
    {
        return fakeDatas.lies[0]
    },
    computed: {
        isALie: function()
        {
            return this.votes.liar > this.votes.notLiar
        }
    },
    methods: {
        vote: function(type)
        {
            this.votes[type]++
        },
        voteLiar: function()
        {
            this.vote('liar')
        },
        voteNotLiar: function()
        {
            this.vote('notLiar')
        }
    }
}))
