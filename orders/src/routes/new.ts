import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tm-tickets-1989/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ticketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId, userId } = req.body;
    // find ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // ensure ticket is not reserved
    const isTicketReserved = await ticket.isReserved();
    if (isTicketReserved) {
      throw new BadRequestError("ticket is already reserved");
    }
    // generate an expiration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build order and save to database
    const order = Order.build({
      expiresAt: expiration,
      status: OrderStatus.Created,
      ticket: ticket,
      userId: req.currentUser!.id,
    });
    await order.save();
    // send an event that order was created
    // TODO

    res.status(201).send(order);
  }
);

export { router as createTicketRouter };
