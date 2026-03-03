import { BoardColumn } from '../entity/board-column.entity';

export class BoardColumnAddedEvent {
  constructor(
    public readonly column: BoardColumn,
    public readonly actorId: string,
  ) {}
}
