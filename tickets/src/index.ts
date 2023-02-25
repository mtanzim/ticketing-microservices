import mongoose from "mongoose";
import nats from "node-nats-streaming";

import { app } from "./app";

const start = async () => {
  const clusterId = process.env.CLUSTER_ID;
  const clientId = process.env.CLIENT_ID;
  const natsURL = process.env.NATS_URL;
  if (!clusterId || !clientId || !natsURL) {
    throw new Error("CLIENT_ID and CLUSTER_ID must be defined for NATS");
  }

  const stan = nats.connect(clusterId, clientId, {
    url: natsURL,
  });

  stan.on("connect", async () => {
    console.log("nats connected");
  });

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
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
