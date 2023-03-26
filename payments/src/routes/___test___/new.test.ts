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

/*
it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
*/
