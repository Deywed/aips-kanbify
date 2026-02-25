import type { BoardMember } from '@/types/auth.types';
import type {
  BoardDetails,
  BoardRole,
  Card,
  Column,
  Tag,
} from '@/types/board.types';

export type BoardCoreSlice = {
  board: BoardDetails | null;
  isLoading: boolean;
  setBoard: (board: BoardDetails) => void;
  setLoading: (isLoading: boolean) => void;
  resetBoard: () => void;
};

export type BoardMembersSlice = {
  addMember: (member: BoardMember) => void;
  removeMember: (userId: string) => void;
  updateMemberRole: (
    userId: string,
    newRole: BoardRole,
    isMe?: boolean,
  ) => void;
};

export type BoardColumnsSlice = {
  addColumn: (column: Column) => void;
  removeColumn: (columnId: string) => void;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  reorderColumn: (columnId: string, newPosition: number) => void;
};

export type BoardTagsSlice = {
  addTag: (tag: Tag) => void;
  deleteTag: (tagId: string) => void;
  updateTag: (tagId: string, newName: string) => void;
};

export type BoardCardsSlice = {
  addCard: (columnId: string, card: Card) => void;
  updateCard: (columnId: string, cardId: string, newCard: Card) => void;
  deleteCard: (columnId: string, cardId: string) => void;
  moveCard: (
    fromColumnId: string,
    toColumnId: string,
    cardId: string,
    updatedCard?: Card,
  ) => void;
};

export type BoardState = BoardCoreSlice &
  BoardMembersSlice &
  BoardColumnsSlice &
  BoardTagsSlice &
  BoardCardsSlice;
