import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  const data = {
    id: "123",
    title: "concert",
    price: 20,
  };
  console.log("connected");
  try {
    await new TicketCreatedPublisher(stan).publish(data);
  } catch (err) {
    console.error(err);
  }
});
