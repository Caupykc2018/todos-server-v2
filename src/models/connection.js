import mongoose from "mongoose";

export const connection = async () => {
  try{
    await mongoose.connect('mongodb://localhost:27017/todos', {
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
