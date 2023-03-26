import {
  // BadRequestError,
  // NotFoundError,
  requireAuth,
  // UnauthorizedError,
  validateRequest,
} from "@tm-tickets-1989/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
// import { Order } from "../models/order";

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
    const curUserId = req.currentUser?.id;
    console.log({ orderId, token, curUserId });

    return res.send({ success: true });

    /*

    // Find the ticket the user is trying to order in the database
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    // Make sure that this ticket is not already reserved
    const isPending = await order.isPending();
    if (!isPending) {
      throw new BadRequestError("order cannot be paid for");
    }

    // create charge

    // publish charge:created message

    res.status(201).send(order);
    */
  }
);

export { router as newChargeRouter };
