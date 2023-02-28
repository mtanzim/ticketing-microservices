import { requireAuth, validateRequest } from "@tm-tickets-1989/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .withMessage("ticketId is required")
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("not a valid mongo id"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
