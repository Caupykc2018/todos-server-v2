import mongoose from "mongoose";
import config from "../config";

export const connection = async () => {
  try{
    await mongoose.connect(config.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    mongoose.set('bufferCommands', false);

    console.log("MongoDB connected");

  }
  catch(e) {
    console.log(e);
  }
}
