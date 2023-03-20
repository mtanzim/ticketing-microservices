import { OrderCreatedEvent, OrderStatus } from "@tm-tickets-1989/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = await Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "whatever",
    price: 44.33,
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket };
};

it("listener updates ticket order id correctly", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const ticketReadback = await Ticket.findById(data.ticket.id);
  expect(ticketReadback).toBeDefined();
  expect(ticketReadback?.orderId).toBe(data.id);
});

it("listener acks message on success", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("listener publishes update to ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toBeCalled();
});
