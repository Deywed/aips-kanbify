import { Card } from '../entity/card.entity';

export class CardCreatedEvent {
  constructor(
    public readonly boardId: string,
    public readonly columnId: string,
    public readonly card: Card,
    public readonly actorId: string,
  ) {}
}
