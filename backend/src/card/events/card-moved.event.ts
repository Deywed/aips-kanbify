import { Card } from '../entity/card.entity';

export class CardMovedEvent {
  constructor(
    public readonly boardId: string,
    public readonly oldColumnId: string,
    public readonly newColumnId: string,
    public readonly oldColumnName: string,
    public readonly newColumnName: string,
    public readonly cardId: string,
    public readonly newPosition: number,
    public readonly card: Card,
    public readonly actorId: string,
  ) {}
}
