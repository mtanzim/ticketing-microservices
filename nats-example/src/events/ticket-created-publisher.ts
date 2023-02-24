import { Publisher } from "@tm-tickets-1989/common";
import { Subjects } from "@tm-tickets-1989/common";
import { TicketCreatedEvent } from "@tm-tickets-1989/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
