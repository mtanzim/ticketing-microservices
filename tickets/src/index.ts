import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app";

const PORT = 3000;
const start = async () => {
  const secret = process.env?.["JWT_KEY"];

  if (!secret) {
    throw new Error("jwt secret not configured");
  }

  try {
    const mongoURI = process.env?.["MONGO_URI"];
    if (!mongoURI) {
      throw new Error("mongo uri not configured");
    }
    console.log(mongoURI);
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => {
    console.log(`started app on port ${PORT}`);
  });
};

start();
