import type { BoardMember } from './auth.types';

export type BoardRole = 'ADMIN' | 'MEMBER';

export type Board = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  role: BoardRole;
  members?: BoardMember[];
};
