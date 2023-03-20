import { Subjects, Publisher, OrderCancelledEvent } from '@tm-tickets-1989/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
