/**
 * App - Provide useful methods across components
 * @type {Object}
 */
var app = {
    firebaseConfig: {
        apiKey: 'AIzaSyAIGDDnLz2_fLIzeyaVMzLZTQKFoAwJncM',
        authDomain: 'liar-bustr.firebaseapp.com',
        databaseURL: 'https://liar-bustr.firebaseio.com',
        storageBucket: 'liar-bustr.appspot.com',
        messagingSenderId: '622874178146'
    },
    vue: null,

    init: function()
    {
        firebase.initializeApp(app.firebaseConfig)

        app.vue = new Vue({
            el: '#app',
            data: {
                fakeDatas: fakeDatas
            }
        })
    },

    /**
     * Perform a GET request
     * @param  {string} url URL of the resource to get
     * @param  {function|null} successCallback Success callback
     * @param  {function|null} errorCallback Error callback
     */
    get: function(url, successCallback, errorCallback)
    {
        var wrappedErrorCallback = function()
        {
            if (app.isCallback(errorCallback))
            {
                errorCallback(data, xhr)
            }
        }

        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)

        xhr.onload = function()
        {
            if (xhr.status >= 200 && xhr.status < 400)
            {
                var data

                try
                {
                    data = JSON.parse(xhr.responseText)
                }
                catch (e)
                {
                    data = xhr.responseText
                }

                if (app.isCallback(successCallback))
                {
                    successCallback(data, xhr)
                }
            }
            else
            {
                wrappedErrorCallback
            }
        }

        xhr.onerror = wrappedErrorCallback

        xhr.send()
    },

    /**
     * Get a template from a name
     * @param  {string} name Template name
     */
    resolveTemplate: function(name, component)
    {
        var path = '/components/' + name + '/' + name + '.html'

        if (!component)
        {
            component = {}
        }

        return function(resolve, reject)
        {
            app.get(path, function(template)
            {
                component.template = template
                resolve(component)
            })
        }
    },

    /**
     * Test if a variable is a valid callback (a function)
     * @param  {*} callback Anything
     * @return {Boolean} true if callback is a function
     */
    isCallback: function(callback)
    {
        return typeof callback === 'function'
    }
}

document.addEventListener('DOMContentLoaded', app.init)
