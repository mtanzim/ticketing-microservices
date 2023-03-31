import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@tm-tickets-1989/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
