import mongoose from "mongoose";

const Schema = mongoose.Schema;


const LoginSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("logins", LoginSchema);
