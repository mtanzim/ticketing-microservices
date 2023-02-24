import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  const data = {
    id: "123",
    title: "concert",
    price: 20,
  };
  console.log("connected");
  new TicketCreatedPublisher(stan).publish(data);
});
