import type { BoardMember } from './auth.types';
import type { BoardRole } from './board.types';

export type BoardMemberAddedPayload = {
  member: BoardMember;
  actorId: string;
};

export type BoardMemberRemovedPayload = {
  member: BoardMember;
  actorId: string;
};

export type BoardMemberRoleUpdatedPayload = {
  userId: string;
  newRole: BoardRole;
  actorId: string;
};
