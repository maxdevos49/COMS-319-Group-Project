import { Response } from "express";
import bcrypt from "bcryptjs";
import config from "../config";
import { IAuthentication, IModelResult, IViewModel } from "./vash/vashInterface";

/**
 * Shared class for commonly reused code`
 */
class Shared {
    /**
     * Method to hash a string like a passord when a new user is registered
     * @param str
     * @returns a string representing a hash
     */
    static hashString(str: string): string {
        if (!config.hash.salt) throw "Salt is invalid";
        let salt = bcrypt.genSaltSync(parseInt(config.hash.salt));
        return bcrypt.hashSync(str, salt);
    }

    /**
     * Method to compare a string to a hash to tell if they match
     * @param str
     * @param hash
     * @returns true or false
     */
    static compareHash(str: string, hash: string): boolean {
        return bcrypt.compareSync(str, hash);
    }

    /**
     * Method designed to escape html in a string
     * @param text
     * @returns an escaped string
     */
    static escapeHtml(text: string): string {
        let map: any = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return text.replace(/[&<>"']/g, function(m) {
            return map[m];
        });
    }

    /**
     * Creates a model for a view to use to display data
     * @param givenResponse express response object
     * @param givenModel
     * @param givenData
     * @returns an object containing all the information the view needs to function
     */
    static getModel(givenResponse: Response, givenModel?: IViewModel, givenData?: any): IModelResult {
        //process auth
        let modelResult: IModelResult = {
            authentication: !givenResponse.locals.authentication ? { role: ["public"] } : givenResponse.locals.authentication
        };

        //process viewmodel
        modelResult.viewModel = givenModel;

        //process data
        modelResult.data = givenData;

        //process validation errors
        // if (givenResponse.locals.error) {
        //add validation
        // for (let key in givenResponse.locals.error) {
        //     if (givenResponse.locals.error[key].properties) {
        //         modelResult.validation[key] = givenResponse.locals.error[key].properties.message;
        //     }
        // }
        // }

        return modelResult;
    }
}

export default Shared;
