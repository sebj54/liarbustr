/* global Vue app router _ */

/**
 * Liar form component
 * @type {VueComponent}
 */
Vue.component('liar-form', app.resolveTemplate('liar-form', {
    data: function()
    {
        const data = {
            liar: this.liarEmptyStructure(),
            isUploading: false,
        }
        return data
    },
    firebase: function()
    {
        return {
            liars: app.db.ref('/liars'),
        }
    },
    computed: {

    },
    methods: {
        liarEmptyStructure: function()
        {
            return {
                uid: _.generateUUID(),
                profilePicture: null,
                name: null,
                familyName: null,
                politicalFamily: null,
                role: null,
                birthDate: null,

            }
        },
        uploadMainPicture: function(e)
        {
            if (e.currentTarget.files.length)
            {
                const folderRef = app.getImagesRef().child('liars/')

                const fileUploaded = function(url)
                {
                    this.isUploading = false
                    this.liar.liarPictureUrl = url
                }.bind(this)

                this.isUploading = true

                app.upload(folderRef, e.currentTarget.files[0])
                .then(fileUploaded)
            }
        },

        saveLiar: function()
        {
            this.$firebaseRefs.liars.child(this.liar.uid).set(this.liar)
        },
    },
}))
