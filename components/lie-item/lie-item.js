/* global Vue app _ user Vibrant window */

/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('lie-item', app.resolveTemplate('lie-item', {
    data: function()
    {
        const data = {
            $header: null,
            $headerImg: null,
            isExpanded: false,
            isReady: false,
            liePictureMainColor: null,
        }

        return data
    },
    firebase: function()
    {
        return {
            lie: {
                source: app.db.ref('/lies/' + this.lieUid),
                asObject: true,
            },
            actualVote: {
                source: app.db.ref('/users/' + user.uid + '/votes/' + this.lieUid),
                asObject: true,
            },
        }
    },
    props: [
        'lie-uid',
    ],
    computed: {
        /**
         * Get actual vote
         * @return {string|null} Actual vote ('liar', 'notLiar' or null)
         */
        actualVoteValue: function()
        {
            return this.actualVote['.value']
        },
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
        },
        /**
         * Get liar votes percentage
         * @return {integer} Votes percentage
         */
        lieVotesPercentageLiar: function()
        {
            return this.lieVotesPercentage('liar')
        },
        /**
         * Get not liar votes percentage
         * @return {integer} Votes percentage
         */
        lieVotesPercentageNotLiar: function()
        {
            return this.lieVotesPercentage('notLiar')
        },
    },
    methods: {
        /**
         * Check if lie-item is ready: if item is visible in viewport and header image is loaded
         */
        checkIfReady: function()
        {
            if (!this.isReady)
            {
                const headerRect = this.$header.getBoundingClientRect()
                const readyTop = headerRect.top > 0 && headerRect.top < window.innerHeight
                const readyBottom = (this.$header.offsetHeight > window.innerHeight) || (headerRect.bottom > 0 && headerRect.bottom < window.innerHeight)

                if (readyTop && readyBottom && this.$headerImg.complete)
                {
                    this.liePictureColor('main')
                    .then(function()
                    {
                        this.isReady = true
                    }.bind(this))
                }
            }
        },
        /**
         * Get lie picture path for a given type
         * @param  {string} type Picture type
         * @return {string} Picture path
         */
        liePicture: function(type)
        {
            return (this.lie.pictures && _.hasProp(this.lie.pictures, type)) ? this.lie.pictures[type] : ''
        },
        /**
         * Get picture's main color for a given image type
         * @param  {string} type Image type
         * @return {Promise<object>} A promise to the color
         */
        liePictureColor: function(type)
        {
            return new Promise(function(resolve, reject)
            {
                const vibrant = new Vibrant(this.liePicture(type))
                vibrant.getPalette(function(err, palette)
                {
                    const color = palette.Vibrant.getHex()
                    this['liePicture' + _.capitalize(type) + 'Color'] = color
                    resolve(color)
                }.bind(this))
            }.bind(this))
        },
        /**
         * Get lie sources for a given type
         * @param  {string} type Sources type
         * @return {string} Sources
         */
        lieSources: function(type)
        {
            return (this.lie.sources && _.hasProp(this.lie.sources, type)) ? this.lie.sources[type] : ''
        },
        /**
         * Get votes count for a given type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         * @return {integer} Votes count
         */
        lieVotesCount: function(type)
        {
            return (this.lie.votes && _.hasProp(this.lie.votes, type)) ? this.lie.votes[type] : 0
        },
        /**
         * Get votes percentage for a given type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         * @return {integer} Votes percentage
         */
        lieVotesPercentage: function(type)
        {
            const votesCountOfType = this.lieVotesCount(type)
            const ratio = votesCountOfType / (votesCountOfType + this.lieVotesCount(this.otherType(type)))
            return ratio * 100
        },
        /**
         * Toggle content's visibility
         */
        toggleContent: function()
        {
            this.isExpanded = !this.isExpanded
        },
        /**
         * Get other type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         * @return {string} Other type of vote (liar or notLiar)
         */
        otherType: function(type)
        {
            return (type === 'liar') ? 'notLiar' : 'liar'
        },
        /**
         * Add a vote for a given type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         */
        vote: function(type)
        {
            // If user has already voted on this lie
            if (this.actualVoteValue !== null)
            {
                // If user has already voted with this type of vote
                if (this.actualVoteValue === type)
                {
                    // Cancel previous user's vote
                    this.$firebaseRefs.lie.ref.child('votes/' + type).set(this.lie.votes[type] - 1)
                    this.$firebaseRefs.actualVote.ref.set(null)
                }
                else
                {
                    // Cancel previous vote
                    const otherType = this.otherType(type)
                    this.$firebaseRefs.lie.ref.child('votes/' + otherType).set(this.lie.votes[otherType] - 1)

                    // Store new vote count
                    this.$firebaseRefs.lie.ref.child('votes/' + type).set(this.lie.votes[type] + 1)

                    // Store user's vote
                    this.$firebaseRefs.actualVote.ref.set(type)
                }
            }
            else
            {
                // Store new votes count
                this.$firebaseRefs.lie.ref.child('votes/' + type).set(this.lie.votes[type] + 1)

                // Store user's vote
                this.$firebaseRefs.actualVote.ref.set(type)
            }
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
        },
    },
    created: function()
    {
        window.addEventListener('scroll', this.checkIfReady)
    },
    destroyed: function()
    {
        window.removeEventListener('scroll', this.checkIfReady)
    },
    mounted: function()
    {
        this.$header = this.$el.querySelector('.lie-item-header')
        this.$headerImg = this.$header.querySelector('.lie-item-picture.-main')

        this.checkIfReady()
    },
}))
