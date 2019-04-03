import { IViewModel, IViewProperty } from "../helpers/vash/vashInterface";
class AccountViewModel implements IViewModel {
    public nickname: IViewProperty = {
        type: String,
        name: "Nickname",
        minlength: 4,
        maxlength: 30,
        required: true
    };

    public email: IViewProperty = {
        type: String,
        name: "Email",
        minlength: 5,
        maxlength: 40,
        required: true
    };

    public password: IViewProperty = {
        type: String,
        name: "Password",
        minlength: 8,
        maxlength: 50,
        required: true
    };

    public role: IViewProperty = {
        type: String,
        name: "Role"
    };

    public isActive: IViewProperty = {
        type: Boolean,
        name: "Status"
    };

    public createdOn: IViewProperty = {
        type: Date,
        name: "Created On"
    };

    public updatedOn: IViewProperty = {
        type: Date,
        name: "Updated On"
    };

    public updatedBy: IViewProperty = {
        type: String,
        name: "Updated By"
    };

    /**
     * Mongoose find,update, and add queries here.
     */
}
