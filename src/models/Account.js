import mongoose from "mongoose";
import Shared from "../helpers/shared";

const Schema = mongoose.Schema;

/**
 * Base Account model
 * @summary Should include all properties for this model with name attrubutes
 */

const AccountModel = new Schema({
    nickname: {
        type: String,
        name: "Nickname",
        minlength: 4,
        maxlength: 30,
        required: true
    },
    email: {
        type: String,
        name: "Email",
        minlength: 5,
        maxlength: 40,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        name: "Password",
        minlength: 8,
        maxlength: 50,
        required: true
    },
    role: {
        type: String,
        name: "Role",
        default: "user"
    },
    isActive: {
        type: Boolean,
        name: "Status",
        default: true
    },
    createdOn: {
        type: Date,
        name: "Created On",
        default: Date.now()
    },
    updatedOn: {
        type: Date,
        name: "Updated On"
    },
    updatedBy: {
        type: String,
        name: "Updated By"
    }
});

/**
 * Virtual property used for comparing passwords upon registration
 */
AccountModel.virtual("passwordConfirmation").name = "Confirm Password";
AccountModel.virtual("passwordConfirmation").matches = "password";

AccountModel.virtual("passwordConfirmation")
    .get(function() {
        return this._passwordConfirmation;
    })
    .set(function(value) {
        this._passwordConfirmation = value;
    });

/**
 * checks upon registering if the two passwords match
 */
AccountModel.pre("validate", function(next) {
    if (this.password !== this.passwordConfirmation) {
        this.invalidate("passwordConfirmation", "Please enter the same password!");
        next();
    }

    this.constructor.find({ email: this.email }, (err, docs) => {
        if (err) throw err;
        if (docs.length > 0) {
            this.invalidate("email", "Email is taken!");
        }
        next();
    });
});

/**
 * Hashes the password and modifies any needed properties after validation is successful
 */
AccountModel.post("validate", (doc, next) => {
    doc.password = Shared.hashString(doc.password);
    doc.roles = "user";
    next();
});

module.exports = mongoose.model("Accounts", AccountModel);;