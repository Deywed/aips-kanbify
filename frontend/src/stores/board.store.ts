import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { BoardMember } from '@/types/auth.types';
import type {
  BoardDetails,
  BoardRole,
  Card,
  Column,
  Tag,
} from '@/types/board.types';

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
  updateMemberRole: (
    userId: string,
    newRole: BoardRole,
    isMe?: boolean,
  ) => void;
  addColumn: (column: Column) => void;
  removeColumn: (columnId: string) => void;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  addTag: (tag: Tag) => void;
  deleteTag: (tagId: string) => void;
  updateTag: (tagId: string, newName: string) => void;
  addCard: (columnId: string, card: Card) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  // TODO: add more actions for columns, cards, etc. as needed

  // Clean up board state when leaving the board page
  resetBoard: () => void;
};

const EMPTY_MEMBERS: BoardMember[] = [];
const EMPTY_COLUMNS: BoardDetails['columns'] = [];
const EMPTY_TAGS: BoardDetails['tags'] = [];

export const useBoardStore = create<BoardState>((set) => ({
  board: null,
  isLoading: true,

  setBoard: (board) => set({ board, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  // Board member actions
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

  updateMemberRole: (userId: string, newRole: BoardRole, isMe?: boolean) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          role: isMe ? newRole : state.board.role,
          members: state.board.members.map((m) =>
            m.id === userId ? { ...m, role: newRole } : m,
          ),
        },
      };
    }),

  // Column actions
  addColumn: (column: Column) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          columns: [
            ...state.board.columns,
            {
              ...column,
              cards: [],
            },
          ],
        },
      };
    }),

  removeColumn: (columnId: string) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          columns: state.board.columns.filter((c) => c.id !== columnId),
        },
      };
    }),

  updateColumnTitle: (columnId: string, newTitle: string) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((c) =>
            c.id === columnId ? { ...c, title: newTitle } : c,
          ),
        },
      };
    }),

  addTag: (tag: Tag) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          tags: [...state.board.tags, tag],
        },
      };
    }),

  deleteTag: (tagId: string) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          tags: state.board.tags.filter((t) => t.id !== tagId),
        },
      };
    }),

  updateTag: (tagId: string, newName: string) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          tags: state.board.tags.map((t) =>
            t.id === tagId ? { ...t, name: newName } : t,
          ),
        },
      };
    }),

  addCard: (columnId: string, card: Card) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((c) =>
            c.id === columnId ? { ...c, cards: [card, ...c.cards] } : c,
          ),
        },
      };
    }),

  deleteCard: (columnId: string, cardId: string) =>
    set((state) => {
      if (!state.board) return {};
      return {
        board: {
          ...state.board,
          columns: state.board.columns.map((c) =>
            c.id === columnId
              ? { ...c, cards: c.cards.filter((card) => card.id !== cardId) }
              : c,
          ),
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

export const useBoardTags = () =>
  useBoardStore((state) => state.board?.tags ?? EMPTY_TAGS);

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
      updateMemberRole: state.updateMemberRole,
      addColumn: state.addColumn,
      removeColumn: state.removeColumn,
      updateColumnTitle: state.updateColumnTitle,
      addTag: state.addTag,
      deleteTag: state.deleteTag,
      updateTag: state.updateTag,
      addCard: state.addCard,
      deleteCard: state.deleteCard,
      resetBoard: state.resetBoard,
    })),
  );
