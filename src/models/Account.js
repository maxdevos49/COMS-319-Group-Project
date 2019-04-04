import mongoose from "mongoose";
const Schema = mongoose.Schema;
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
//# sourceMappingURL=Account.js.map