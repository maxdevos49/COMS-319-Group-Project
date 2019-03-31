/**
     * Helper function that checks model for any validations and then creates an attribute object 
     * @param {*} property
     * @returns an object representing attributes needed for jquery unobtrusive validation
     */
    module.exports = function(property) {

        let result = { "data-val": "true" };

        /**
         * Required
         */
        if (typeof (property.required) !== "undefined") {
            //check model format
            if (Array.isArray(property.required)) {
                //use custom message
                Object.assign(result, { "data-val-required": property.required[1] });
            } else {
                //use generic message
                Object.assign(result, { "data-val-required": `${property.display || property.path} is required!` });
            }
        }

        /**
         * Minimum Length
         */
        if (typeof (property.minlength) !== "undefined") {
            //check model format
            if (Array.isArray(property.minlength)) {
                //use custom message
                Object.assign(result, {
                    "data-val-minlength-min": property.minlength[0],
                    "data-val-minlength": property.minlength[1]
                });
            } else {
                //use generic message
                Object.assign(result, {
                    "data-val-minlength-min": property.minlength,
                    "data-val-minlength": `${property.display || property.path} must be atleast ${property.minlength} characters long!`
                });
            }
        }

        /**
         * Maximum Length
         */
        if (typeof (property.maxlength) !== "undefined") {
            //check model format
            if (Array.isArray(property.maxlength)) {
                //use custom message
                Object.assign(result, {
                    "data-val-maxlength-max": property.maxlength[0],
                    "data-val-maxlength": property.maxlength[1]
                });
            } else {
                //use generic message
                Object.assign(result, {
                    "data-val-maxlength-max": property.maxlength,
                    "data-val-maxlength": `${property.display || property.path} cannot exceed ${property.maxlength} characters long!`
                });
            }
        }

        /**
         * Equal To
         */
        if (typeof (property.matches) !== "undefined") {
            //check model format
            if (Array.isArray(property.matches)) {
                //use custom message
                Object.assign(result, {
                    "data-val-equalto-other": property.matches[0],
                    "data-val-equalto": property.matches[1]
                });
            } else {
                //use generic message
                Object.assign(result, {
                    "data-val-equalto-other": property.matches,
                    "data-val-equalto": `${property.display || property.path} must match ${property.matches}!`
                });
            }
        }

        /**
         * Validate options
         */
        if (typeof (property.validate) !== "undefined") {
            /**
             * Regular Expression
             *  data-val-regex="Error message"
             *  data-val-regex-pattern="The regular expression (e.g. ^[a-z]+$)"
             */
            /*if (property.validate[0] instanceof RegExp || property.validate instanceof RegExp) {

                //check model format
                if (Array.isArray(property.validate)) {
                    //use custom message
                    Object.assign(result, {
                        "data-val-regex": property.validate[1],
                        "data-val-regex-pattern": property.validate[0]
                    });
                } else {
                    //use generic message
                    Object.assign(result, {
                        "data-val-regex": `${property.display || property.path} must fit the pattern of '${property.validate}'`,
                        "data-val-regex-pattern": property.validate
                    });
                }
            }*/

    }

        /**
         * Credit Card
         *  data-val-creditcard="Error message"
         */


        /**
         * Email
         *  data-val-email="Error message"
         */


        /**
         * Range
         *  data-val-range="Error message"
         *  data-val-range-max="Max value"
         *  data-val-range-min="Min value"
         */




        /**
         * String Length
         *  data-val-length="Error message"
         *  data-val-length-max="Maximum number of characters"
         */

        /**
         * Number
         * data-val-number=”ErrMsg”
         */

        /**
         * URL
         * data-val-url=”ErrMsg”
         */

        /**
         * Helpful Regex
         * 
         * Number	
         *   ^(\d{1,3},?(\d{3},?)*\d{3}(\.\d{1,3})?|\d{1,3}(\.\d{2})?)$
         * 
         * Date
         *   ^[0,1]?\d{1}\/(([0-2]?\d{1})|([3][0,1]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))$
         * 
         * URL	
         *   ^(http|https)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*$
         * 
         * Phone
         *   ^([\+][0-9]{1,3}([ \.\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9A-Z \.\-]{1,32})((x|ext|extension)?[0-9]{1,4}?)$
         * 
         */

        return result;
    }