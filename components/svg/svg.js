Vue.component('svg_', {

    props: ['name'],

    data: function() {

        var self = this
        var template = null



        var getIcon = function() {

            if(app.svgTemplates) {

                template = app.svgTemplates[self.name]

            }

            else {
                loadIcons();
            }
        },

        loadIcons = function()
        {

            app.get('/components/svg/svg.html', function(svgTemplates)
            {
                app.svgTemplates = {}
                var parser = new DOMParser()
                xmlDoc = parser.parseFromString(svgTemplates, "text/xml")

                var templates = xmlDoc.getElementsByTagName('svg')

                for (var i = 0; i < templates.length; i++) {
                    svgID = templates[i].getAttribute('id')

                    app.svgTemplates[svgID] = templates[i]
                }
            })
        }

        return {

        }
    },

    template: "<span>coucou</span>",

})
