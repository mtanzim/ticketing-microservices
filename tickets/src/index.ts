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
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => {
    console.log(`started app on port ${PORT}`);
  });
};

start();
