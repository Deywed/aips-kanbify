import type { StateCreator } from 'zustand';

import type { ChatMessage } from '@/types/chat.types';
import type { BoardState } from './types';

export type BoardChatSlice = {
  isChatOpen: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  hasMore: boolean;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  setMessages: (messages: ChatMessage[]) => void;
  prependMessages: (messages: ChatMessage[]) => void;
  appendMessage: (message: ChatMessage) => void;
  setHasMore: (hasMore: boolean) => void;
  resetChat: () => void;
};

export const createBoardChatSlice: StateCreator<
  BoardState,
  [],
  [],
  BoardChatSlice
> = (set) => ({
  isChatOpen: false,
  unreadCount: 0,
  messages: [],
  hasMore: true,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (open) => set({ isChatOpen: open }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  setMessages: (messages) => set({ messages }),
  prependMessages: (older) =>
    set((state) => ({ messages: [...older, ...state.messages] })),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setHasMore: (hasMore) => set({ hasMore }),
  resetChat: () =>
    set({
      isChatOpen: false,
      unreadCount: 0,
      messages: [],
      hasMore: true,
    }),
});
