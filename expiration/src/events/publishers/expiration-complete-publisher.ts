import { Publisher } from "@tm-tickets-1989/common";
import { Subjects } from "@tm-tickets-1989/common";
import { ExpirationCompleteEvent } from "@tm-tickets-1989/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
