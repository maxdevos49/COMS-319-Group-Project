import bcrypt from "bcryptjs";
import config from "../config";

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
        if(!config.hash.salt) throw "Salt is invalid";
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
        let map:any = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }

    /**
     * Creates a model for a view to use to display data
     * @param givenResponse 
     * @param givenModel
     * @param givenData
     * @returns an object containing all the information the view needs to function
     */
    static getModel(givenResponse: any, givenModel:any = null, givenData:any = null): any {

        //TODO Change this someday as it is error prone in special senarios

        //init result object
        let result: any = {
            authentication: {},
            model: {},
            data: {},
            validation: {}
        };

        //model processing
        if (givenModel) {
            result.model = givenModel.schema.tree;
            //add path
            for (let key in givenModel.schema.tree) {
                result.model[key].path = key;
            }
        }

        // validation processing
        // if (givenResponse.user.error) {
        //     //add validation
        //     for (let key in givenResponse.user.error) {
        //         if (givenResponse.user.error[key].properties) {
        //             result.validation[key] = givenResponse.user.error[key].properties.message;
        //         }
        //     }
        // }

        //add authentication
        result.authentication = givenResponse.user;

        //add data
        result.data = givenData || givenResponse.req.body;

        return result;
    }
}

export default Shared;
