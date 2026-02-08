import { create } from 'zustand';

import type { BoardMember } from '@/types/auth.types';
import type { BoardDetails } from '@/types/board.types';
import { useShallow } from 'zustand/react/shallow';

type BoardState = {
  // State
  board: BoardDetails | null;
  isLoading: boolean;

  // Actions
  setBoard: (board: BoardDetails) => void;
  setLoading: (isLoading: boolean) => void;

  // Real time actions for WebSocket updates
  addMember: (member: BoardMember) => void;
  removeMember: (userId: string) => void;
  // TODO: add more actions for columns, cards, etc. as needed

  // Clean up board state when leaving the board page
  resetBoard: () => void;
};

const EMPTY_MEMBERS: BoardMember[] = [];
const EMPTY_COLUMNS: BoardDetails['columns'] = [];

export const useBoardStore = create<BoardState>((set) => ({
  board: null,
  isLoading: false,

  setBoard: (board) => set({ board }),

  setLoading: (isLoading) => set({ isLoading }),

  addMember: (member) =>
    set((state) => {
      if (!state.board) return {};

      if (state.board.members.find((m) => m.id === member.id)) return {};

      return {
        board: {
          ...state.board,
          members: [...state.board.members, member],
        },
      };
    }),

  removeMember: (userId) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          members: state.board.members.filter((m) => m.id !== userId),
        },
      };
    }),

  resetBoard: () => set({ board: null, isLoading: false }),
}));

// Custom hooks
export const useBoardInfo = () =>
  useBoardStore(
    useShallow((state) => ({
      id: state.board?.id,
      title: state.board?.title,
      description: state.board?.description,
    })),
  );

export const useBoardMembers = () =>
  useBoardStore((state) => state.board?.members ?? EMPTY_MEMBERS);

export const useBoardColumns = () =>
  useBoardStore((state) => state.board?.columns ?? EMPTY_COLUMNS);

export const useUserBoardRole = () =>
  useBoardStore((state) => state.board?.role);

export const useIsBoardLoading = () =>
  useBoardStore((state) => state.isLoading);

export const useBoardActions = () =>
  useBoardStore(
    useShallow((state) => ({
      setBoard: state.setBoard,
      setLoading: state.setLoading,
      addMember: state.addMember,
      removeMember: state.removeMember,
      resetBoard: state.resetBoard,
    })),
  );
