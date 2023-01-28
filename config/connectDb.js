import mongoose from "mongoose";

mongoose.set("strictQuery", true);
const connectDb = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL, { dbName: "authWithJWT" });
    console.log("Connected Successfully...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
