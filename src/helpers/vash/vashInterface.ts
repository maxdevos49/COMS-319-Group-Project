export interface IAuthentication {
    /**
     * The first name of the currently logged in user
     */
    firstname?: string;

    /**
     * The last name of the currently logged in user
     */
    lastname?: string;

    /**
     * The nickname of the currently logged in user
     */
    nickname?: string;

    /**
     * The role of the currently logged in user
     */
    role: string[];

    /**
     * The email of the logged in user
     */
    email?: string;

    /**
     * The session token of the logged in user.
     */
    token?: string;
}
export interface IViewModel {
    /**
     * Outputs the class as json
     */
}
export interface IViewProperty {
    /**
     * The type constructor function
     */
    type: Function;

    /**
     * The database property name
     */
    path: string;

    /**
     * The display name of the property
     */
    name?: string;

    /**
     * The minimum length of the property
     */
    minlength?: number;

    /**
     * The maximum length of the property
     */
    maxlength?: number;

    /**
     * Indicates whether the property is optional
     */
    required?: boolean;

    /**
     * Indicates if the value of the current property
     * should match another property. Give the other
     * property name to compare with.
     */
    matches?: string;
}
export interface IValidation {
}
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
}
export enum InputType {
    String = "String",
    Number = "Number",
    Date = "Date",
    Boolean = "Boolean",
    Other = ""
}
