import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Board } from '@/types/board.types';
import type { UpdateBoardPayload } from '@/pages/Boards/schema/newBoard.schema';

import { useBaseMutation } from '../useBaseMutation';

export const useUpdateBoardMutation = (boardId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<Board, Error, UpdateBoardPayload>(
    {
      path: API_ENDPOINTS.BOARD(boardId),
      method: 'PATCH',
    },
    {
      onSuccess: (updatedBoard) => {
        queryClient.setQueryData<Board[]>(
          [API_ENDPOINTS.BOARDS],
          (prevBoards) => {
            if (!prevBoards) {
              return [updatedBoard];
            }

            return prevBoards.map((board) =>
              board.id === updatedBoard.id
                ? {
                    ...board,
                    title: updatedBoard.title,
                    description: updatedBoard.description,
                  }
                : board,
            );
          },
        );

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BOARD(boardId)],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
