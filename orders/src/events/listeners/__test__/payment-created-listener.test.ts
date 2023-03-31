import { OrderStatus, PaymentCreatedEvent } from "@tm-tickets-1989/common";
import { natsWrapper } from "../../../nats-wrapper";
import { PaymentCreatedListener } from "../payment-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new PaymentCreatedListener(natsWrapper.client);
  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: undefined as any,
  });
  await order.save();
  const data: PaymentCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    orderId: order.id,
    stripeId: "whatever",
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it("listener updates order to be complete", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const orderReadback = await Order.findById(data.orderId);
  expect(orderReadback).toBeDefined();
  expect(orderReadback?.status).toBe(OrderStatus.Complete);
});

it("listener acks message on success", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  await Ticket.findById(data.id);
  expect(msg.ack).toHaveBeenCalled();
});
