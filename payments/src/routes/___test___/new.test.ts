import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
// import { Order, OrderStatus } from '../../models/order';
import { Order, OrderStatus } from "../../models/order";
// import { natsWrapper } from '../../nats-wrapper';

it("returns an error if the order does not exist", async () => {
  const orderId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin().cookieArr)
    .send({ orderId, token: "whatever" })
    .expect(404);
});

it("returns an error if the order does not belong to the user", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    price: 44,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin().cookieArr)
    .send({ orderId, token: "whatever" })
    .expect(401);
});

it("returns an error if the order is cancelled", async () => {
  const { userId, cookieArr } = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    price: 44,
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookieArr)
    .send({ orderId, token: "whatever" })
    .expect(400);
});
