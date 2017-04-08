/* global Vue app _ user window router */

/**
 * Lie item component
 * @type {VueComponent}
 */
Vue.component('lie-item', app.resolveTemplate('lie-item', {
    data: function()
    {
        const data = {
            /**
             * Header element
             * @type {DOMElement}
             */
            $header: null,
            /**
             * Header image element
             * @type {DOMElement}
             */
            $headerImg: null,
            /**
             * Expanded state (content shown)
             * @type {Boolean}
             */
            isExpanded: false,
            /**
             * Flipped state (true if back of the card is shown)
             * @type {Boolean}
             */
            isFlipped: false,
            /**
             * Ready state (true if in viewport and image is loaded)
             * @type {Boolean}
             */
            isReady: false,
            /**
             * Lie object (Firebase binding)
             * @type {object}
             */
            lie: null,
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
        'meta',
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
         * Get description sample (truncated description)
         * @return {string|null} Description sample
         */
        getDescriptionSample: function()
        {
            return _.hasProp(this.lie, 'text') ? this.lie.text.substring(0, 300) : null
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
        /**
         * Shareable URL
         * @return {string} URL
         */
        shareUrl: function()
        {
            return window.location.protocol + '//' + window.location.hostname + '/lie/' + (_.hasProp(this.lie, 'uid') ? this.lie.uid : this.lieUid)
        },
    },
    watch: {
        lie: function()
        {
            if (this.meta)
            {
                router.meta.length = 0
                router.meta.push(
                    {
                        property: 'og:title',
                        content: this.$t('lie.share.title', { liar: this.lie.liar }),
                    },
                    {
                        property: 'og:type',
                        content: 'article',
                    },
                    {
                        property: 'og:image',
                        content: this.liePictureUrl('main'),
                    },
                    {
                        property: 'og:url',
                        content: this.shareUrl,
                    },
                    {
                        property: 'og:description',
                        content: this.getDescriptionSample,
                    }
                )
                router.title = this.$t('lie.share.title', { liar: this.lie.liar })
                router.description = this.getDescriptionSample
            }
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
                    this.isReady = true
                }
            }
        },
        /**
         * Get lie picture path for a given type
         * @param  {string} type Picture type
         * @return {string} Picture path
         */
        liePictureUrl: function(type)
        {
            return _.getPropValue(this.lie, 'pictures.' + type + '.url')
        },
        /**
         * Get picture's main color for a given image type
         * @param  {string} type Image type
         * @return {Promise<object>} A promise to the color
         */
        liePictureColor: function(type)
        {
            return _.getPropValue(this.lie, 'pictures.' + type + '.color')
        },
        /**
         * Get lie sources for a given type
         * @param  {string} type Sources type
         * @return {string} Sources
         */
        lieSources: function(type)
        {
            return _.getPropValue(this.lie, 'sources.' + type)
        },
        /**
         * Get votes count for a given type of vote
         * @param  {string} type Type of vote (liar or notLiar)
         * @return {integer} Votes count
         */
        lieVotesCount: function(type)
        {
            return _.getPropValue(this.lie, 'votes.' + type) || 0
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
        /**
         * Show back of the card
         */
        showCardBack: function()
        {
            this.isFlipped = true
        },
        /**
         * Hide back of the card
         */
        hideCardBack: function()
        {
            this.isFlipped = false
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
