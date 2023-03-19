import { TicketCreatedEvent } from "@tm-tickets-1989/common";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 44.44,
    title: "hello",
    userId: "23232",
    version: 0,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("listener persists ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.price).toBe(data.price);
});

it("listener acks message on success", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  await Ticket.findById(data.id);
  expect(msg.ack).toHaveBeenCalled();
});
