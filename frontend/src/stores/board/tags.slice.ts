import type { StateCreator } from 'zustand';

import { withBoardUpdate } from './helpers';
import type { BoardState, BoardTagsSlice } from './types';

export const createBoardTagsSlice: StateCreator<
  BoardState,
  [],
  [],
  BoardTagsSlice
> = (set) => ({
  addTag: (tag) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        tags: [...board.tags, tag],
      })),
    ),

  deleteTag: (tagId) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        tags: board.tags.filter((tag) => tag.id !== tagId),
      })),
    ),

  updateTag: (tagId, newName) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        tags: board.tags.map((tag) =>
          tag.id === tagId ? { ...tag, name: newName } : tag,
        ),
      })),
    ),
});
