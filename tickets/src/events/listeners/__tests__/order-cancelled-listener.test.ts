import { OrderCancelledEvent } from "@tm-tickets-1989/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = await Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: "whatever",
    price: 44.33,
  });
  ticket.orderId = "something";
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
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
  expect(ticketReadback?.orderId).toBe(undefined);
});

it("listener acks message on success", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("listener publishes update to ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
