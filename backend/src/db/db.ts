import mongoose from "mongoose";
import env from "../libs/env.js";

const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(env.MONGO_URL);
    console.log("Db Connected");
  } catch (error) {
    console.error("App starting error:", error);
    process.exit(1);
  }
};

export { db };
