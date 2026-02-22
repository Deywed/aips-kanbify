import type { BoardDetails } from '@/types/board.types';

export const withBoardUpdate =
  <T extends { board: BoardDetails | null }>(
    updater: (board: BoardDetails) => BoardDetails,
  ) =>
  (state: T) => {
    if (!state.board) return {};
    return { board: updater(state.board) };
  };
