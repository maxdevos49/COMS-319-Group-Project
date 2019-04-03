import mongoose from "mongoose";
import Shared from "../helpers/shared";

const Schema = mongoose.Schema;

/**
 * Base Account model
 */

const AccountModel = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    updatedOn: {
        type: Date
    },
    updatedBy: {
        type: String
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

module.exports = mongoose.model("Accounts", AccountModel);
