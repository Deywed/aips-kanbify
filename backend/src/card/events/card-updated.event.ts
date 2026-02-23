import { Card } from '../entity/card.entity';

export class CardUpdatedEvent {
  constructor(
    public readonly boardId: string,
    public readonly columnId: string,
    public readonly card: Card,
    public readonly actorId: string,
    public readonly oldCard?: Card,
  ) {}
}
