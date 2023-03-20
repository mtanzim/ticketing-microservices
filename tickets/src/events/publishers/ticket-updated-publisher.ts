import { Publisher, Subjects, TicketUpdatedEvent } from "@tm-tickets-1989/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
