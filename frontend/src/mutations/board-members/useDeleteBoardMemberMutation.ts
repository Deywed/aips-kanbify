import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteBoardMemberMutation = (
  boardId: string,
  userId: string,
) => {
  const queryClient = useQueryClient();

  return useBaseMutation<{ id: string }, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_BOARD_MEMBER(boardId, userId),
      method: 'DELETE',
    },
    {
      onSuccess: () => {
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
