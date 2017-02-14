/**
 * App - Provide useful methods across components
 * @type {Object}
 */
var app = {
    /**
     * Firebase config parameters
     * @type {Object}
     */
    firebaseConfig: {
        apiKey: "AIzaSyC2HAMgUYDOJdp_69RQbp4N-uyxeGqr_WI",
        authDomain: "liarbustr.firebaseapp.com",
        databaseURL: "https://liarbustr.firebaseio.com",
        storageBucket: "liarbustr.appspot.com",
        messagingSenderId: "405782866530"
    },
    /**
     * Current language
     * @type {string}
     */
    lang: null,
    /**
     * Available translations
     * @type {Object}
     */
    locales: {
        en: {},
        fr: {}
    },
    /**
     * Vue instance
     * @type {Vue}
     */
    vue: null,

    /**
     * Init function
     */
    init: function()
    {
        firebase.initializeApp(app.firebaseConfig)

        // Set locales - load only 2 first languages for performance reasons and because vue-i18n requires at least two languages
        var availableLangs = Object.keys(app.locales)
        app.changeLocale(availableLangs[1])
        app.changeLocale(availableLangs[0], true) // fallback lang

        Vue.config.missingHandler = function (lang, key, vm)
        {
            console.warn('Translation error: (lang: "' + lang + '" for key: "' + key + '")')
        }

        app.vue = new Vue({
            el: '#app',
            router: new VueRouter({
                routes: router.routes
            })
        })

        firebase.auth().onAuthStateChanged(function(firebaseUser)
        {
            if (firebaseUser)
            {
                user.fetchUser(firebaseUser)
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
            if (_.isCallback(errorCallback))
            {
                errorCallback(xhr)
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

                if (_.isCallback(successCallback))
                {
                    successCallback(data, xhr)
                }
            }
            else
            {
                wrappedErrorCallback()
            }
        }

        xhr.onerror = wrappedErrorCallback

        xhr.send()
    },

    /**
     * Get locale
     * @param  {string} lang Lang locale
     * @return {function} Promise-like function
     */
    getLocale: function(lang)
    {
        return function(resolve, reject)
        {
            var result = null

            if (app.locales.hasOwnProperty(lang))
            {
                if (_.isEmptyObject(app.locales[lang]))
                {
                    app.get(
                        'locales/' + lang + '.json',
                        function(locale)
                        {
                            app.locales[lang] = (typeof locale === 'object') ? locale : {}
                            result = resolve(app.locales[lang])
                        },
                        function()
                        {
                            result = reject()
                        }
                    )
                }
                else
                {
                    result = resolve(app.locales[lang])
                }
            }
            else
            {
                result = reject()
            }

            return result
        }
    },

    /**
     * Get a template from a name
     * @param  {string} name Template name (filename without .html or path related to components directory)
     */
    resolveTemplate: function(name, component)
    {
        var fullName = (name.indexOf('/') !== -1) ? name : name + '/' + name
        var path = 'components/' + fullName + '.html'

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
     * Change locale
     * @param  {string} lang Locale string (e.g. 'en', 'fr')
     * @param  {Boolean} isFallback true if locale is fallback
     */
    changeLocale: function(lang, isFallback)
    {
        Vue.locale(
            lang,
            function()
            {
                return app.getLocale(lang)
            },
            function()
            {
                if (isFallback)
                {
                    Vue.config.fallbackLang = lang
                }

                Vue.config.lang = lang
            }
        )
    }
}

document.addEventListener('DOMContentLoaded', app.init)
