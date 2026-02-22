import type { StateCreator } from 'zustand';

import { withBoardUpdate } from './helpers';
import type { BoardColumnsSlice, BoardState } from './types';

export const createBoardColumnsSlice: StateCreator<
  BoardState,
  [],
  [],
  BoardColumnsSlice
> = (set) => ({
  addColumn: (column) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        columns: [
          ...board.columns,
          {
            ...column,
            cards: [],
          },
        ],
      })),
    ),

  removeColumn: (columnId) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        columns: board.columns.filter((column) => column.id !== columnId),
      })),
    ),

  updateColumnTitle: (columnId, newTitle) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        columns: board.columns.map((column) =>
          column.id === columnId ? { ...column, title: newTitle } : column,
        ),
      })),
    ),
});
