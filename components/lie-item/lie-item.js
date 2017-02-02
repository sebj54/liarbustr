Vue.component('lie-item', app.resolveTemplate('lie-item', {
    props: [
        'lie'
    ],
    computed: {
        isALie: function()
        {
            return this.votes.liar > this.votes.notLiar
        }
    },
    methods: {
        vote: function(type)
        {
            this.lie.votes[type]++
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
