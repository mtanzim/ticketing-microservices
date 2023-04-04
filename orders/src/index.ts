import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  const clusterId = process.env.NATS_CLUSTER_ID;
  const natsURL = process.env.NATS_URL;
  const clientId = process.env.NATS_CLIENT_ID;
  if (!clusterId) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!natsURL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!clientId) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    console.log("nats info");
    console.log({ clusterId, clientId, natsURL });
    await natsWrapper.connect(clusterId, clientId, natsURL);

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed.");
      process.exit();
    });

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("orders listening on port 3000");
  });
};

process.on("SIGINT", () => natsWrapper.client.close());
process.on("SIGTERM", () => natsWrapper.client.close());

start();
