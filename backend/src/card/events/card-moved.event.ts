import { Card } from '../entity/card.entity';

export class CardMovedEvent {
  constructor(
    public readonly boardId: string,
    public readonly oldColumnId: string,
    public readonly newColumnId: string,
    public readonly card: Card,
    public readonly userId: string,
  ) {}
}
