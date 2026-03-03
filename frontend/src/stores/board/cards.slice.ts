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

  updateCard: (columnId, cardId, newCard) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === columnId
            ? {
                ...column,
                cards: column.cards.map((card) =>
                  card.id === cardId ? newCard : card,
                ),
              }
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

  moveCard: (fromColumnId, toColumnId, cardId, updatedCard) =>
    set(
      withBoardUpdate((board) => {
        const sourceCol = board.columns.find((c) => c.id === fromColumnId);
        const card =
          updatedCard ?? sourceCol?.cards.find((c) => c.id === cardId);
        if (!card) return board;

        return {
          ...board,
          columns: board.columns.map((col) => {
            if (col.id === fromColumnId && fromColumnId !== toColumnId) {
              return {
                ...col,
                cards: col.cards.filter((c) => c.id !== cardId),
              };
            }
            if (col.id === toColumnId && fromColumnId !== toColumnId) {
              const cards = [...col.cards, card].sort(
                (a, b) => a.position - b.position,
              );
              return { ...col, cards };
            }
            if (col.id === fromColumnId && fromColumnId === toColumnId) {
              const cards = col.cards
                .map((c) => (c.id === cardId ? (updatedCard ?? c) : c))
                .sort((a, b) => a.position - b.position);
              return { ...col, cards };
            }
            return col;
          }),
        };
      }),
    ),
});
