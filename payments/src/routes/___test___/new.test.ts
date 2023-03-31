import { Subjects } from "@tm-tickets-1989/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Payment } from "../../models/payment";
import { natsWrapper } from "../../nats-wrapper";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

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

it("succeeds if everything else is in order", async () => {
  const { userId, cookieArr } = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    price: 44,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookieArr)
    .send({ orderId, token: "tok-nuka-cola" })
    .expect(201);

  const mockOptions = (stripe.charges.create as jest.Mock).mock.lastCall[0];

  expect(mockOptions).toStrictEqual({
    currency: "cad",
    source: "tok-nuka-cola",
    amount: 44 * 100,
  });
});

it("creates a new payment document if successful", async () => {
  // see mock
  const stripeId = "ch_3MqPfkG2Yz03o3oL1iFSzvEy";
  const { userId, cookieArr } = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    price: 44,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookieArr)
    .send({ orderId, token: "tok-nuka-cola" })
    .expect(201);

  const newPayment = await Payment.findOne({
    orderId,
    stripeId,
  });
  expect(newPayment?.orderId).toBe(orderId);
  expect(newPayment?.stripeId).toBe(stripeId);
});

it("publishes a payment created event if successful", async () => {
  // see mock
  const stripeId = "ch_3MqPfkG2Yz03o3oL1iFSzvEy";
  const { userId, cookieArr } = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    price: 44,
    status: OrderStatus.Created,
    userId,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookieArr)
    .send({ orderId, token: "tok-nuka-cola" })
    .expect(201);

  const subject = (natsWrapper.client.publish as jest.Mock).mock.lastCall[0];
  const data = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.lastCall[1]
  );
  const newPayment = await Payment.findOne({
    orderId,
    stripeId,
  });
  expect(data).toStrictEqual({
    stripeId: newPayment?.stripeId,
    orderId: newPayment?.orderId,
    id: newPayment?.id,
  });
  expect(subject).toBe(Subjects.PaymentCreated);
});
