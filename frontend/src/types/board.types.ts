export type BoardRole = 'ADMIN' | 'MEMBER';

export type Board = {
  id: string;
  title: string;
  description?: string;
  role: BoardRole;
  createdAt: string;
  updatedAt: string;
};
