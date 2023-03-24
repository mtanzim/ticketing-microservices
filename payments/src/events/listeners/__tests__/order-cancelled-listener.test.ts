import { OrderCancelledEvent, OrderStatus } from "@tm-tickets-1989/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 44,
    status: OrderStatus.Created,
    userId: "sdsds",
    version: 0,
  });
  await order.save();
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "blah",
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("listener cancels order on message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order?.status).toBe(OrderStatus.Cancelled);
});
it("listener ignores incorrect versions", async () => {
  const { listener, data, msg } = await setup();
  try {
    await listener.onMessage({ ...data, version: 10101 }, msg);
  } catch (err) {
    expect(err).toBeDefined();
    return;
  }
  throw new Error("test failed");
});

it("listener acks message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
