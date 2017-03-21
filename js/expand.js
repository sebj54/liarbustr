/* global Vue window _ */

/**
 * Calculate height of a given element
 * @param  {DOMElement} el Element for which calculate height
 * @param  {boolean} expanded Expanded state (true: expanded, false otherwise)
 */
function calcHeight(el, expanded)
{
    const currentClass = expanded ? '-is-expanded' : '-is-not-expanded'

    el.classList.add('u-no-transition')
    el.classList.remove(currentClass)
    el.style.height = null
    el.style.height = el.clientHeight + 'px'
    el.classList.add(currentClass)
    el.classList.remove('u-no-transition')
}

/**
 * Expand Vue directive
 * Dynamically add classes to a block from a simple boolean
 * @type {VueDirective}
 */
Vue.directive('expand', {
    inserted: function(el, binding)
    {
        calcHeight(el, binding.value)
        window.addEventListener('resize', _.debounce(function()
        {
            calcHeight(el, binding.value)
        }, 250))
    },
    update: function(el, binding)
    {
        if (el.style.height)
        {
            if (binding.value)
            {
                el.classList.add('-is-expanded')
                el.classList.remove('-is-not-expanded')
            }
            else
            {
                el.classList.remove('-is-expanded')
                el.classList.add('-is-not-expanded')
            }
        }
        else
        {
            calcHeight(el, binding.value)
        }
    },
})
