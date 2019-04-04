import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
        default: ["user"]
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


export default mongoose.model("Accounts", AccountModel);
