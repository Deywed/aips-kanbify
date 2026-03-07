import type { User } from './auth.types';

export type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
};
