import nats from "node-nats-streaming";
import { Subjects } from "./events/subjects";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const TOPIC = Subjects.TicketCreated;

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
