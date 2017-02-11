/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('lie-item', app.resolveTemplate('lie-item', {
    data: function()
    {
        return {
            /**
             * Lie
             * @type {object}
             */
            lie: (this.lieObject) ? this.lieObject : this.fromId(this.lieId)
        }
    },
    props: [
        'lie-id',
        'lie-object'
    ],
    computed: {
        /**
         * Test if current lie is a lie or not, based on votes
         * @return {Boolean} true if lie a lie, false otherwise
         */
        isALie: function()
        {
            return this.lie.votes.liar > this.lie.votes.notLiar
        },
        /**
         * Split text in chunks (chunks are serparated by a line break)
         * @return {Array} Text chunks
         */
        lieTextChunks: function()
        {
            return this.lie.text.split('\n')
        }
    },
    methods: {
        /**
         * Retrieve a lie from its id
         * @param  {integer|string} id Lie IF
         * @return {object} Lie
         */
        fromId: function(id)
        {
            var lie = {}

            for (var i = 0; i < fakeDatas.lies.length; i++)
            {
                if (fakeDatas.lies[i].id === parseInt(id))
                {
                    lie = fakeDatas.lies[i]
                    break
                }
            }

            return lie
        },
        /**
         * Add a vote for a given type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         */
        vote: function(type)
        {
            this.lie.votes[type]++
        },
        /**
         * Add vote for "liar"
         */
        voteLiar: function()
        {
            this.vote('liar')
        },
        /**
         * Add vote for "notLiar"
         */
        voteNotLiar: function()
        {
            this.vote('notLiar')
        }
    }
}))
