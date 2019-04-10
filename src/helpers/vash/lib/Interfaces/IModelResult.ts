import { IAuthentication } from "./IAuthentication";
import { IViewModel } from "./IViewModel";
import { IValidation } from "./IValidation";
import { IConfig } from "./IConfig";

export interface IModelResult {
    /**
     * The authentication object
     */
    authentication: IAuthentication;

    /**
     * The view model for the view
     */
    viewModel?: IViewModel;

    /**
     * The data refrenced from the view model
     */
    data?: any[] | any;

    /**
     * Validatoin errors object
     */
    validation?: IValidation[];

    configuration: IConfig;
}