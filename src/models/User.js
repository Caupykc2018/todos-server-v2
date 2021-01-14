import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {versionKey: false});

export const User = mongoose.model("User", userSchema);
