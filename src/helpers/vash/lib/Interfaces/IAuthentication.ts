export interface IAuthentication {
    /**
     * The session token of the logged in user.
     */
    id?: string;

    /**
     * The nickname of the currently logged in user
     */
    nickname?: string;

    /**
     * The role of the currently logged in user
     */
    role: string;
}