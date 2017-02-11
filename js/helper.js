/**
 * Helper - Provide useful methods
 * @type {Object}
 */
var _ = {
    /**
     * Test if a variable is a valid callback (a function)
     * @param  {*} callback Anything
     * @return {Boolean} true if callback is a function, false otherwise
     */
    isCallback: function(callback)
    {
        return typeof callback === 'function'
    },

    /**
     * Test if an object is empty
     * @param  {*} obj object to test
     * @return {Boolean} true if object is empty or is not an object, false otherwise
     */
    isEmptyObject: function(obj)
    {
        var isEmpty = true

        if (obj)
        {
            for (var prop in obj)
            {
                if (obj.hasOwnProperty(prop))
                {
                    isEmpty = false
                    break
                }
            }
        }

        return isEmpty
    }
}
