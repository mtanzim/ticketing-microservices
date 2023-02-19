import nats, { Message } from "node-nats-streaming";

import { randomBytes } from "crypto";

console.clear();
const TOPIC = "ticket:created";
const QUEUE_GROUP = "orders-service-queue-group";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected");
  const subscription = stan.subscribe(TOPIC, QUEUE_GROUP);
  subscription.on("message", (msg: Message) => {
    console.log("received message");
    const data = msg.getData();
    const n = msg.getSequence();
    if (typeof data === "string") {
      console.log(`Received event #${n}, with data: ${data}`);
    }
  });
});
