import { Listener, OrderCreatedEvent, Subjects } from "@tm-tickets-1989/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log("waiting...");
    console.log(data);
    msg.ack();
  }
}
