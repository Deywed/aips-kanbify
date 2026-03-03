import { BoardMember, BoardRole } from '../entity/board-members.entity';

export class BoardMemberEvent {
  constructor(
    public readonly boardId: string,
    public readonly targetMember: BoardMember,
    public readonly changedByUserId: string,
    public readonly role?: BoardRole,
  ) {}
}
