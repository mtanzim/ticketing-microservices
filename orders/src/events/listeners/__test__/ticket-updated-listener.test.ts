import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@tm-tickets-1989/common";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const data: TicketUpdatedEvent["data"] = {
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

it("listener persists ticket if version is correct", async () => {
  const { listener, data, msg } = await setup();
  const ticket = await Ticket.build(data);
  await ticket.save();

  const updatedData = { ...data, version: data.version + 1, price: 99.99 };
  await listener.onMessage(updatedData, msg);
  const tickeReadback = await Ticket.findById(data.id);
  expect(tickeReadback).toBeDefined();
  expect(tickeReadback?.price).toBe(updatedData.price);
  expect(msg.ack).toBeCalled();
});

it("listener does NOT persists ticket if version is NOT correct", async () => {
  const { listener, data, msg } = await setup();
  const ticket = await Ticket.build(data);
  await ticket.save();

  const updatedData = { ...data, version: data.version + 3, price: 99.99 };
  try {
    await listener.onMessage(updatedData, msg);
  } catch (_) {
    const tickeReadback = await Ticket.findById(data.id);
    expect(tickeReadback?.price).toBe(data.price);
    expect(msg.ack).not.toBeCalled();
  }
});
