import type { BoardMember, User } from './auth.types';

export const BOARD_ROLES = ['ADMIN', 'MEMBER'] as const;

export type BoardRole = (typeof BOARD_ROLES)[number];

export type Board = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  role: BoardRole;
  members: BoardMember[];
};

export type BoardDetails = Board & {
  columns: Column[];
};

export type Column = {
  id: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
};

export type Card = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  position: number;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  name: string;
};
