import type { StateCreator } from 'zustand';

import { withBoardUpdate } from './helpers';
import type { BoardMembersSlice, BoardState } from './types';

export const createBoardMembersSlice: StateCreator<
  BoardState,
  [],
  [],
  BoardMembersSlice
> = (set) => ({
  addMember: (member) =>
    set((state) => {
      if (!state.board) return {};

      if (
        state.board.members.some(
          (existingMember) => existingMember.id === member.id,
        )
      ) {
        return {};
      }

      return {
        board: {
          ...state.board,
          members: [...state.board.members, member],
        },
      };
    }),

  removeMember: (userId) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        members: board.members.filter((member) => member.id !== userId),
      })),
    ),

  updateMemberRole: (userId, newRole, isMe) =>
    set(
      withBoardUpdate((board) => ({
        ...board,
        role: isMe ? newRole : board.role,
        members: board.members.map((member) =>
          member.id === userId ? { ...member, role: newRole } : member,
        ),
      })),
    ),
});
