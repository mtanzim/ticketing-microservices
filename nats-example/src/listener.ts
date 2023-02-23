import { randomBytes } from "crypto";
import nats, { Message } from "node-nats-streaming";

console.clear();
const TOPIC = "ticket:created";
const QUEUE_GROUP = "orders-service-queue-group";
const DURABLE_GROUP = "orders-service-durable-group";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected");

  stan.on("close", () => {
    console.log("NATS connection closed.");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName(DURABLE_GROUP);

  const subscription = stan.subscribe(TOPIC, QUEUE_GROUP, options);
  subscription.on("message", (msg: Message) => {
    console.log("received message");
    const data = msg.getData();
    const n = msg.getSequence();
    if (typeof data === "string") {
      console.log(`Received event #${n}, with data: ${data}`);
    }
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
