import type { BoardMember } from './auth.types';
import type { BoardRole, Card, Column, Tag } from './board.types';

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

// Board tags
export type BoardTagAddedPayload = {
  tag: Tag;
  actorId: string;
};

export type BoardTagRemovedPayload = {
  boardId: string;
  tagId: string;
  actorId: string;
};

export type BoardTagUpdatedPayload = {
  boardId: string;
  tagId: string;
  name: string;
  actorId: string;
};

// Cards
export type CardAddedPayload = {
  boardId: string;
  columnId: string;
  card: Card;
  actorId: string;
};

export type CardDeletedPayload = {
  boardId: string;
  columnId: string;
  cardId: string;
  actorId: string;
};
