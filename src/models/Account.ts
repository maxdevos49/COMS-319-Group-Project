import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IAccount {
    id: string;
    nickname: string;
    email: string;
    password?: string;
    role?: string[];
    isActive?: Boolean;
    createdOn?: Date;
    updatedOn?: Date;
    updatedBy?: String;
}

const AccountSchema = new Schema({
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
        required: true
    },
    token: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
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

export default mongoose.model("Account", AccountSchema);
