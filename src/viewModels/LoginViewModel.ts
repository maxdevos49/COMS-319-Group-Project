import { IViewProperty, IViewModel } from "../helpers/vash/vashInterface";

export default class LoginViewModel implements IViewModel {
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

}
