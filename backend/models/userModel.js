import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    profileImage: {
        type: String,
        default: null
    },
    otpReset: {
        type: Number,
        default: null
    },
    otpResetExpires: {
        type: Date,
        default: null
    },
}, { minimize: false })

const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;