import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true,
    }
}, {versionKey: false});

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
