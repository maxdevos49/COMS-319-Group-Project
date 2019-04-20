import { IViewProperty } from "./Interfaces/IViewProperty";

/**
 * Helper function that checks IViewproperties for any validations and then creates an attribute object
 * @param property
 * @returns an object with key value pairs representing what properties to add.
 */
export function Validation(property: IViewProperty) {
    let result = { "data-val": "true" };
    /**
     * Required
     */
    if (typeof property.required !== "undefined") {
        //check model format
        if (Array.isArray(property.required)) {
            //use custom message
            Object.assign(result, { "data-val-required": property.required[1] });
        } else {
            //use generic message
            Object.assign(result, { "data-val-required": `${property.name || property.path} is required!` });
        }
    }

    /**
     * Minimum Length
     */
    if (typeof property.minlength !== "undefined") {
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
                "data-val-minlength": `${property.name || property.path} must be atleast ${property.minlength} characters long!`
            });
        }
    }

    /**
     * Maximum Length
     */
    if (typeof property.maxlength !== "undefined") {
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
                "data-val-maxlength": `${property.name || property.path} cannot exceed ${property.maxlength} characters long!`
            });
        }
    }

    /**
     * Equal To
     */
    if (typeof property.matches !== "undefined") {
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
                "data-val-equalto": `${property.name || property.path} must match ${property.matches}!`
            });
        }
    }

    return result;
}
