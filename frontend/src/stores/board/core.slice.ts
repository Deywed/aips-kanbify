import type { StateCreator } from 'zustand';

import type { BoardCoreSlice, BoardState } from './types';

export const createBoardCoreSlice: StateCreator<
  BoardState,
  [],
  [],
  BoardCoreSlice
> = (set) => ({
  board: null,
  isLoading: true,
  setBoard: (board) => set({ board, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  resetBoard: () => set({ board: null, isLoading: false }),
});
