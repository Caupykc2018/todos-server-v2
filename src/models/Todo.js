import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
}, {versionKey: false});

export const Todo = mongoose.model("Todo", todoSchema);
