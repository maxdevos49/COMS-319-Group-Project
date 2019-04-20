import { IViewModel } from "../helpers/vash/lib/Interfaces/IViewModel";
import { IViewProperty } from "../helpers/vash/lib/Interfaces/IViewProperty";

export class RegisterViewModel implements IViewModel {
    public nickname: IViewProperty = {
        type: String,
        path: "nickname",
        name: "Nickname",
        minlength: 3,
        maxlength: 40,
        required: true
    };

    public email: IViewProperty = {
        type: String,
        path: "email",
        name: "Email",
        minlength: 5,
        maxlength: 40,
        required: true
    };

    public password: IViewProperty = {
        type: String,
        path: "password",
        name: "Password",
        minlength: 8,
        maxlength: 50,
        required: true
    };

    public passwordConfirmation: IViewProperty = {
        type: String,
        path: "passwordConfirmation",
        name: "Password Confirmation",
        minlength: 8,
        maxlength: 50,
        matches: "password",
        required: true
    };

}
