import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middleware/error-handler";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import mongoose from "mongoose";

const app = express();
app.use(json());
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
``;

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
const PORT = 3000;

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB")
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => {
    console.log(`started app on port ${PORT}`);
  });
};

start();
