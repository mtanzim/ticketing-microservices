import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
  validateRequest,
} from "@tm-tickets-1989/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("token must be provided"),
    body("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("orderId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    // Find the ticket the user is trying to order in the database
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    // Make sure that this pending payment
    if (!order.isPending()) {
      throw new BadRequestError("order cannot be paid for");
    }

    // create charge
    await stripe.charges.create({
      amount: order.price * 100,
      currency: "cad",
      source: token,
    });

    // publish charge:created message

    res.status(201).send(order);
  }
);

export { router as newChargeRouter };
