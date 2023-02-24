import { Message } from 'node-nats-streaming';
import { Listener } from '@tm-tickets-1989/common';
import { TicketCreatedEvent } from '@tm-tickets-1989/common';
import { Subjects } from '@tm-tickets-1989/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
