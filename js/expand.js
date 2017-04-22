/* global Vue window _ */

/**
 * Expand Vue directive
 * Dynamically add classes to a block from a simple boolean
 * @type {VueDirective}
 */
Vue.directive('expand', {
    /**
     * Element bound
     * @type {DOMElement}
     */
    el: null,
    /**
     * isExpanded state (true if expanded)
     * @type {Boolean}
     */
    isExpanded: false,
    /**
     * Calculate height of a given element
     * @param  {DOMElement} el Element for which calculate height
     */
    calcHeight: function()
    {
        const currentClass = this.isExpanded ? '-is-expanded' : '-is-not-expanded'

        this.el.classList.add('u-no-transition')
        this.el.classList.remove(currentClass)
        this.el.style.height = null
        this.el.style.height = this.el.clientHeight + 'px'
        this.el.classList.add(currentClass)
        this.el.classList.remove('u-no-transition')
    },
    inserted: function(el, binding)
    {
        binding.def.el = el
        binding.def.isExpanded = binding.value
        binding.def.calcHeight()

        window.addEventListener('resize', _.debounce(function()
        {
            binding.def.calcHeight()
        }, 250))
    },
    update: function(el, binding)
    {
        binding.def.isExpanded = binding.value

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
            binding.def.calcHeight()
        }
    },
})
