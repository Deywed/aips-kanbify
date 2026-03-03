import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { BoardMember } from '@/types/auth.types';
import type { BoardRole } from '@/types/board.types';

import { useBoardActions } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

type AddBoardMemberVariables = {
  userId: string;
  role: BoardRole;
};

export const useAddBoardMemberMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  const { addMember } = useBoardActions();

  return useBaseMutation<BoardMember, Error, AddBoardMemberVariables>(
    { path: API_ENDPOINTS.ADD_BOARD_MEMBER(boardId) },
    {
      onSuccess: (data) => {
        addMember(data);
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
