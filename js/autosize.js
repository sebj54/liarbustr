/* global Vue autosize window document */

/**
 * Autosize Vue directive
 * Dynamically resize textareas based on their content
 * @type {VueDirective}
 */
Vue.directive('autosize', {
    inserted: function(el)
    {
        if (el.tagName === 'TEXTAREA')
        {
            autosize(el)
        }
        else
        {
            const fakeInput = document.createElement('span')
            const updateFakeInput = function()
            {
                fakeInput.innerHTML = el.value || el.getAttribute('placeholder')
                el.style.width = fakeInput.offsetWidth + 'px'
            }

            fakeInput.className = el.className + ' -is-fake-input'
            updateFakeInput()

            el.addEventListener('input', updateFakeInput)

            el.parentNode.appendChild(fakeInput)
        }
    },
    update: function(el)
    {
        if (el.tagName !== 'TEXTAREA')
        {
            const event = document.createEvent('HTMLEvents')
            event.initEvent('input', true, false)
            el.dispatchEvent(event)
        }
    },
})
