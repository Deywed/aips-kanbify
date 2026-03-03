import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Board } from '@/types/board.types';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteBoardMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<{ id: string }, Error, void>(
    {
      path: API_ENDPOINTS.BOARD(boardId),
      method: 'DELETE',
    },
    {
      onSuccess: ({ id }) => {
        queryClient.setQueryData<Board[]>(
          [API_ENDPOINTS.BOARDS],
          (oldBoards) =>
            oldBoards ? oldBoards.filter((board) => board.id !== id) : [],
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
