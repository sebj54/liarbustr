Vue.component('lie-item', app.resolveTemplate('lie-item', {
    props: [
        'lie'
    ],
    computed: {
        isALie: function()
        {
            return this.lie.votes.liar > this.lie.votes.notLiar
        },
        lieTextChunks: function()
        {
            return this.lie.text.split('\n')
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
