import type { BoardMember } from './auth.types';
import type { BoardRole, Column } from './board.types';

// Board members
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

// Board columns
export type BoardColumnAddedPayload = {
  column: Column;
  actorId: string;
};

export type BoardColumnRemovedPayload = {
  boardId: string;
  columnId: string;
  actorId: string;
};

export type BoardColumnUpdatedPayload = {
  boardId: string;
  columnId: string;
  title: string;
  actorId: string;
};
