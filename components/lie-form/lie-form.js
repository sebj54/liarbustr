/* global Vue app _ user window Vibrant */

/**
* Lie form component
* @type {VueComponent}
*/
Vue.component('lie-form', app.resolveTemplate('lie-form', {
    data: function()
    {
        return {
            /**
            * Lie-item header
            * @type {DOMElement}
            */
            $header: null,
            /**
            * Lie item header image
            * @type {DOMElement}
            */
            $headerImg: null,
            /**
            * Lie
            * @type {object}
            */
            lie: this.lieEmptyStructure(),
            /**
            * Indicates if lie-item is in viewport and loaded
            * @type {Boolean}
            */

            isReady: false,
            /**
            * Indicates if a picture is being uploaded
            * @type {Boolean}
            */
            isUploading: false,

            /**
            *   Used to open or close Liars list
            */
            liarListOpened: false,

            selectedLiar: {},


        }
    },
    firebase: function()
    {
        return {
            lies: app.db.ref('/lies'),
            liars: app.db.ref('/liars'),
        }
    },
    computed: {
        liarFullName: function()
        {
            if (this.selectedLiar.name)
            {
                return this.selectedLiar.name + ' ' + this.selectedLiar.familyName
            }
        },
    },
    methods: {
        /**
        * Add a source
        * @param {string} type Source type
        */
        addSource: function(type)
        {
            this.lie.sources[type].push({
                title: '',
                url: '',
            })
        },

        selectLiar: function(liar)
        {
            this.selectedLiar = liar
            this.lie.liar = liar.uid
            this.liarListOpened = false
        },

        openLiarList: function()
        {
            this.liarListOpened = true
        },
        /**
        * Add a statement source
        */
        addStatement: function()
        {
            this.addSource('statements')
        },
        /**
        * Add a refutation source
        */
        addRefutation: function()
        {
            this.addSource('refutations')
        },
        /**
        * Add a confirmation source
        */
        addConfirmation: function()
        {
            this.addSource('confirmations')
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
                uid: _.generateUUID(),
                isModerated: false,
                accuser: null,
                title: '',
                liar: '',
                text: '',
                votes: {
                    liar: 0,
                    notLiar: 0,
                },
                sources: {
                    statements: [{
                        title: '',
                        url: '',
                    }],
                    refutations: [{
                        title: '',
                        url: '',
                    }],
                    confirmations: [{
                        title: '',
                        url: '',
                    }],
                },
                pictures: {
                    main: {
                        url: '',
                        color: '',
                    },
                },
            }
        },
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
            return new Promise(function(resolve, reject)
            {
                if (!this.lie.pictures[type].color)
                {
                    const vibrant = new Vibrant(this.liePictureUrl(type))
                    vibrant.getPalette(function(err, palette)
                    {
                        if (palette)
                        {
                            const color = palette.Vibrant.getHex()
                            this.lie.pictures[type].color = color
                            resolve(color)
                        }
                    }.bind(this))
                }
            }.bind(this))
        },
        /**
        * Remove empty sources (essential before saving in database)
        */
        removeEmptySources: function()
        {
            Object.keys(this.lie.sources).forEach(function(type)
            {
                this.lie.sources[type].forEach(function(source, index)
                {
                    if (source.url.length === 0)
                    {
                        this.lie.sources[type].splice(index, 1)
                    }
                }.bind(this))
            }.bind(this))
        },
        /**
        * Save a lie
        */
        saveLie: function()
        {
            this.removeEmptySources()
            this.lie.accuser = user.uid
            this.$firebaseRefs.lies.child(this.lie.uid).set(this.lie)

            app.router.push('lie/' + this.lie.uid)

            this.lie = this.lieEmptyStructure()
        },
        /**
        * Upload main picture and store it. Function must be a callback triggered on change on a file input
        * @param  {event} e Event
        */
        uploadMainPicture: function(e)
        {
            if (e.currentTarget.files.length)
            {
                const folderRef = app.getImagesRef().child('lies/')

                const fileUploaded = function(url)
                {
                    this.isUploading = false
                    this.lie.pictures.main.url = url
                }.bind(this)

                this.isUploading = true

                app.upload(folderRef, e.currentTarget.files[0])
                .then(fileUploaded)
            }
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
