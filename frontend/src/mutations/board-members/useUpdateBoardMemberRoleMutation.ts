import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBoardActions } from '@/stores/board.store';

import type { BoardMember } from '@/types/auth.types';
import type { BoardRole } from '@/types/board.types';

import { useBaseMutation } from '../useBaseMutation';

type UpdateBoardMemberRoleVariables = {
  role: BoardRole;
};

export const useUpdateBoardMemberRoleMutation = (
  boardId: string,
  userId: string,
) => {
  const queryClient = useQueryClient();

  const { updateMemberRole } = useBoardActions();

  return useBaseMutation<BoardMember, Error, UpdateBoardMemberRoleVariables>(
    {
      path: API_ENDPOINTS.UPDATE_BOARD_MEMBER_ROLE(boardId, userId),
      method: 'PATCH',
    },
    {
      onSuccess: (_updatedMember, variables) => {
        updateMemberRole(userId, variables.role);
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BOARDS],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
