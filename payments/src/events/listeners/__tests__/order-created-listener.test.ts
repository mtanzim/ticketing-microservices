import { OrderCreatedEvent, OrderStatus } from "@tm-tickets-1989/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "23232",
    version: 0,
    expiresAt: new Date().toDateString(),
    status: OrderStatus.Created,
    ticket: {
      id: "blah",
      price: 55.66,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("listener persists order", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order?.price).toBe(data.ticket.price);
  expect(order?.id).toBe(data.id);
});
it("listener acks message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
