/* global Vue window _ */

/**
 * Expand Vue directive
 * Dynamically add classes to a block from a simple boolean
 * @type {VueDirective}
 */
Vue.directive('expand', {
    /**
     * Object containing elements (uid as a key) and isExpanded state
     * @type {object}
     */
    els: {},
    /**
     * Resize event set (true if set)
     * @type {Boolean}
     */
    resizeEventSet: false,
    /**
     * Calculate height of a given element
     * @param  {string} uid Element's UID
     */
    calcHeight: function(uid)
    {
        const currentClass = this.els[uid].isExpanded ? '-is-expanded' : '-is-not-expanded'

        this.els[uid].el.classList.add('u-no-transition')
        this.els[uid].el.classList.remove(currentClass)
        this.els[uid].el.style.height = null
        this.els[uid].el.style.height = this.els[uid].el.clientHeight + 'px'
        this.els[uid].el.classList.add(currentClass)
        this.els[uid].el.classList.remove('u-no-transition')
    },
    inserted: function(el, binding)
    {
        const uid = _.generateUUID()
        el.dataset.uid = uid
        binding.def.els[uid] = {
            el: el,
            isExpanded: binding.value,
        }

        binding.def.calcHeight(uid)

        if (!binding.def.resizeEventSet)
        {
            binding.def.resizeEventSet = true
            window.addEventListener('resize', _.debounce(function()
            {
                Object.keys(binding.def.els).forEach(function(elUid)
                {
                    binding.def.calcHeight(elUid)
                })
            }, 250))
        }
    },
    update: function(el, binding)
    {
        binding.def.els[el.dataset.uid].isExpanded = binding.value

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
            binding.def.calcHeight(el.dataset.uid)
        }
    },
    unbind: function(el, binding)
    {
        delete binding.def.els[el.dataset.uid]
    },
})
