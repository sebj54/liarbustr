/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('lie-item', app.resolveTemplate('lie-item', {
    data: function()
    {
        var data = {}

        if (this.lieObject)
        {
            data.lie = this.lieObject
        }

        return data
    },
    firebase: function()
    {
        var key = (this.lieUid) ? this.lieUid : this.lie.uid

        return {
            lie: {
                source: app.db.ref('/lies/' + key),
                asObject: true
            }
        }
    },
    props: [
        'lie-uid',
        'lie-object'
    ],
    computed: {
        /**
         * Test if current lie is a lie or not, based on votes
         * @return {Boolean} true if lie a lie, false otherwise
         */
        isALie: function()
        {
            return (this.lie.votes) ? this.lie.votes.liar > this.lie.votes.notLiar : false
        },
        /**
         * Get lie main picture path
         * @return {string} Picture path
         */
        liePictureMain: function()
        {
            return this.liePicture('main')
        },
        /**
         * Get lie statements sources
         * @return {string} Sources
         */
        lieSourcesStatements: function()
        {
            return this.lieSources('statements')
        },
        /**
         * Get lie refutations sources
         * @return {string} Sources
         */
        lieSourcesRefutations: function()
        {
            return this.lieSources('refutations')
        },
        /**
         * Get lie confirmations sources
         * @return {string} Sources
         */
        lieSourcesConfirmations: function()
        {
            return this.lieSources('confirmations')
        },
        /**
         * Split text in chunks (chunks are serparated by a line break)
         * @return {Array} Text chunks
         */
        lieTextChunks: function()
        {
            return (this.lie.text) ? this.lie.text.split('\n') : []
        },
        /**
         * Get liar votes count
         * @return {integer} Votes count
         */
        lieVotesCountLiar: function()
        {
            return this.lieVotesCount('liar')
        },
        /**
         * Get not liar votes count
         * @return {integer} Votes count
         */
        lieVotesCountNotLiar: function()
        {
            return this.lieVotesCount('notLiar')
        }
    },
    methods: {
        /**
         * Get lie picture path for a given type
         * @param  {string} type Picture type
         * @return {string} Picture path
         */
        liePicture: function(type)
        {
            return (this.lie.pictures && this.lie.pictures.hasOwnProperty(type)) ? this.lie.pictures[type] : ''
        },
        /**
         * Get lie sources for a given type
         * @param  {string} type Sources type
         * @return {string} Sources
         */
        lieSources: function(type)
        {
            return (this.lie.sources && this.lie.sources.hasOwnProperty(type)) ? this.lie.sources[type] : ''
        },
        /**
         * Get votes count for a given type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         * @return {integer} Votes count
         */
        lieVotesCount: function(type)
        {
            return (this.lie.votes && this.lie.votes.hasOwnProperty(type)) ? this.lie.votes[type] : 0
        },
        /**
         * Add a vote for a given type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         */
        vote: function(type)
        {
            var voteRef = app.db.ref('/users/' + user.uid + '/votes/' + this.lie.uid)

            voteRef.once('value').then(function(snapshot)
            {
                // If user has already voted on this lie
                if (snapshot.exists())
                {
                    // If user has already voted with this type of vote
                    if (snapshot.val() === type)
                    {
                        // Cancel previous user's vote
                        this.$firebaseRefs.lie.ref.child('votes/' + type).set(this.lie.votes[type] - 1)
                        voteRef.set(null)
                    }
                    else
                    {
                        // Cancel previous vote
                        var otherType = (type === 'liar') ? 'notLiar' : 'liar';
                        this.$firebaseRefs.lie.ref.child('votes/' + otherType).set(this.lie.votes[otherType] - 1)

                        // Store new vote count
                        this.$firebaseRefs.lie.ref.child('votes/' + type).set(this.lie.votes[type] + 1)

                        // Store user's vote
                        voteRef.set(type)
                    }
                }
                else
                {
                    // Store new votes count
                    this.$firebaseRefs.lie.ref.child('votes/' + type).set(this.lie.votes[type] + 1)

                    // Store user's vote
                    voteRef.set(type)
                }
            }.bind(this))
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
