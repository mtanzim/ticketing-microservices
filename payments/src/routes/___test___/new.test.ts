import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../__mocks__/stripe";

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

  const mockOptions = JSON.parse(
    (stripe.charges.create as jest.Mock).mock.calls[0]
  );
  console.log(mockOptions);
  expect(mockOptions).toBe({
    currency: "cad",
    source: "tok-nuka-cola",
    amount: 44 * 100,
  });
});
