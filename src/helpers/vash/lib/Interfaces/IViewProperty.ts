
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