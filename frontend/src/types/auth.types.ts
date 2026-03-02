import type { BoardRole } from './board.types';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  createdAt: string;
};

export type BoardMember = User & {
  role?: BoardRole;
};
