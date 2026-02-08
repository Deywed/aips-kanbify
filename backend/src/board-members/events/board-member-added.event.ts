import { BoardRole } from '../entity/board-members.entity';

export class BoardMemberAddedEvent {
  constructor(
    public readonly boardId: string,
    public readonly targetUserId: string,
    public readonly addedByUserId: string,
    public readonly role: BoardRole,
  ) {}
}
