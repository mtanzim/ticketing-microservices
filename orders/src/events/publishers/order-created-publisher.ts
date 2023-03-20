import { Publisher, OrderCreatedEvent, Subjects } from '@tm-tickets-1989/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
