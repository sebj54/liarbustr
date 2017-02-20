/* eslint no-bitwise: "off", no-mixed-operators: "off" */

/**
 * Helper - Provide useful methods
 * @type {Object}
 */
const _ = {

    cleanObject: function(object)
    {
        if(!this.isEmptyObject(object))
            Object.keys(object).forEach(function(key) {
                delete object[key]
            })
    },

    /**
     * Get file extension from filename
     * @param  {string} filename Filename
     * @return {string} File extension or empty string if filename has no extension
     */
    fileExtension: function(filename)
    {
        return filename.substr(filename.lastIndexOf('.') + 1)
    },

    /**
     * Generate a UUID fast, RFC4122 version 4 compliant.
     * @author Jeff Ward (jcward.com).
     * @license MIT license
     * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
     */
    generateUUID: function()
    {
        const lut = []

        for (let i = 0; i < 256; i++)
        {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16)
        }

        const d0 = Math.random() * 0xffffffff | 0
        const d1 = Math.random() * 0xffffffff | 0
        const d2 = Math.random() * 0xffffffff | 0
        const d3 = Math.random() * 0xffffffff | 0

        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]
    },

    /**
     * Test if an object has a property
     * @param  {object} object Object which should contain the property
     * @param  {string} prop Property name
     * @return {boolean} true if object has property
     */
    hasProp: function(object, prop)
    {
        return Object.prototype.hasOwnProperty.call(object, prop)
    },

    /**
     * Get property value from an object or null if property doesn't exist
     * @param  {object} object Object which contains the property
     * @param  {string} prop Property name
     * @return {*} Property value if set or null
     */
    getPropValue: function(object, prop)
    {
        return (_.hasProp(object, prop) && object[prop]) ? object[prop] : null
    },

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
        return Object.getOwnPropertyNames(obj).length === 0
    },
}
