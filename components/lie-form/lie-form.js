/**
 * Lie form component
 * @type {VueComponent}
 */
Vue.component('lie-form', app.resolveTemplate('lie-form', {
    data: function()
    {
        return {
            /**
             * Lie
             * @type {object}
             */
            lie: this.lieEmptyStructure()
        }
    },
    firebase: function()
    {
        return {
            lies: app.db.ref('/lies')
        }
    },
    methods: {
        /**
         * Add a source
         * @param {string} type Source type
         */
        addSource: function(type)
        {
            this.lie.sources[type].push('')
        },
        /**
         * Add a source for the statement
         */
        addStatement: function()
        {
            this.addSource('statements')
        },
        /**
         * Get field ID (html attribute)
         * @param  {string} name Field name
         * @return {string} Field name + unique identifier
         */
        fieldId: function(name)
        {
            return name + '-' + this._uid
        },
        /**
         * Get empty structure of a lie
         * @return {object} Lie
         */
        lieEmptyStructure: function()
        {
            return {
                accuser: user.uid,
                title: '',
                liar: '',
                text: '',
                votes: {
                    liar: 0,
                    notLiar: 0
                },
                sources: {
                    statements: [],
                    refutations: [],
                    confirmations: []
                },
                pictures: {
                    main: null
                }
            }
        },
        /**
         * Save a lie
         */
        saveLie: function()
        {
            this.$firebaseRefs.lies.push(this.lie)

            this.lie = this.lieEmptyStructure()
            setTimeout(this.addStatement) // setTimeout is mandatory for rendering to avoid not cleared source input
        },
        /**
         * Upload main picture and store it. Function must be a callback triggered on change on a file input
         * @param  {event} e Event
         */
        uploadMainPicture: function(e)
        {
            if (e.currentTarget.files.length)
            {
                var folderRef = app.getImagesRef().child('lies/')
                var fileUploaded = function(url)
                {
                    this.lie.pictures.main = url
                }.bind(this)

                app.upload(folderRef, e.currentTarget.files[0])
                .then(fileUploaded)
            }
        }
    },
    created: function()
    {
        this.addStatement()
    }
}))
