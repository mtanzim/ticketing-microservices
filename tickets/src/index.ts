import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";
import { randomBytes } from "crypto";
const start = async () => {
  const clusterId = process.env.CLUSTER_ID;
  const natsURL = process.env.NATS_URL;
  if (!clusterId || !natsURL) {
    throw new Error("CLIENT_ID and CLUSTER_ID must be defined for NATS");
  }
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsWrapper.connect(
      clusterId,
      randomBytes(4).toString("hex"),
      natsURL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed.");
      process.exit();
    });

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("tickets listening on port 3000");
  });
};

process.on("SIGINT", () => natsWrapper.client.close());
process.on("SIGTERM", () => natsWrapper.client.close());

start();
