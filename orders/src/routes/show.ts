import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  UnauthorizedError,
} from '@tm-tickets-1989/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {

    console.log(req.currentUser)

    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      console.log(order)
      throw new UnauthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
