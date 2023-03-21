import { natsWrapper } from "./nats-wrapper";
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
  } catch (err) {
    console.error(err);
  }
};

process.on("SIGINT", () => natsWrapper.client.close());
process.on("SIGTERM", () => natsWrapper.client.close());

start();
