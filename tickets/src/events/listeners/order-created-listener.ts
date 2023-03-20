import { Listener, OrderCreatedEvent, Subjects } from "@tm-tickets-1989/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent({
      id: data.ticket.id,
      version: data.version,
    });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    // await ticket.set({ s});
    // await ticket.save();
    msg.ack();
  }
}
