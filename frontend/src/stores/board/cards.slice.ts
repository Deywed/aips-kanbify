import type { StateCreator } from 'zustand';

import { withBoardUpdate } from './helpers';
import type { BoardCardsSlice, BoardState } from './types';

export const createBoardCardsSlice: StateCreator<
  BoardState,
  [],
  [],
  BoardCardsSlice
> = (set) => ({
  addCard: (columnId, card) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === columnId
            ? { ...column, cards: [card, ...column.cards] }
            : column,
        ),
      })),
    ),

  deleteCard: (columnId, cardId) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: column.cards.filter((card) => card.id !== cardId),
              }
            : column,
        ),
      })),
    ),
});
