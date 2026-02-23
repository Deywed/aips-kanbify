import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import type { BoardMember } from '@/types/auth.types';
import type { BoardState } from './board';
import {
  createBoardCardsSlice,
  createBoardColumnsSlice,
  createBoardCoreSlice,
  createBoardMembersSlice,
  createBoardTagsSlice,
} from './board';

const EMPTY_MEMBERS: BoardMember[] = [];
const EMPTY_COLUMNS: NonNullable<BoardState['board']>['columns'] = [];
const EMPTY_TAGS: NonNullable<BoardState['board']>['tags'] = [];

export const useBoardStore = create<BoardState>((...a) => ({
  ...createBoardCoreSlice(...a),
  ...createBoardMembersSlice(...a),
  ...createBoardColumnsSlice(...a),
  ...createBoardTagsSlice(...a),
  ...createBoardCardsSlice(...a),
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

// TODO: later should split into separate hooks for each slice (e.g. useBoardMembersActions, useBoardColumnsActions, etc.)
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
      updateCard: state.updateCard,
      deleteCard: state.deleteCard,
      resetBoard: state.resetBoard,
    })),
  );
