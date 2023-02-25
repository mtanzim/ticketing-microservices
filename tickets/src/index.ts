import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";

const start = async () => {
  const clusterId = process.env.CLUSTER_ID;
  const clientId = process.env.CLIENT_ID;
  const natsURL = process.env.NATS_URL;
  if (!clusterId || !clientId || !natsURL) {
    throw new Error("CLIENT_ID and CLUSTER_ID must be defined for NATS");
  }
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await natsWrapper.connect(clusterId, clientId, natsURL);
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("tickets listening on port 3000");
  });
};

start();
