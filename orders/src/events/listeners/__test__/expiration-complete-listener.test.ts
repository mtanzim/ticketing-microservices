import { ExpirationCompleteEvent, OrderStatus } from "@tm-tickets-1989/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "rolling stones",
    price: 34343434,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
    userId: "whocares",
  });
  await order.save();
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};


it("listener updates order to be cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const orderReadback = await Order.findById(data.orderId);
  expect(orderReadback).toBeTruthy();
  expect(orderReadback?.status).toBe(OrderStatus.Cancelled);
  expect(String(orderReadback?.ticket)).toEqual(String(order.ticket.id));
});

it("listener acks message on success", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("listener emits OrderCancelled event", async () => {
  (natsWrapper.client.publish as jest.Mock).mockClear()
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  console.log(eventData)
  expect(eventData.id).toEqual(order.id);
});
