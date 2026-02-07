import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Board } from '@/types/board.types';
import type { NewBoardSchemaType } from '@/pages/Boards/schema/newBoard.schema';

import { useBaseMutation } from '../useBaseMutation';

export const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<Board, Error, NewBoardSchemaType>(
    { path: API_ENDPOINTS.BOARDS },
    {
      onSuccess: (data) => {
        queryClient.setQueryData<Board[]>(
          [API_ENDPOINTS.BOARDS],
          (prevBoards) => {
            if (!prevBoards) {
              return [data];
            }
            return [data, ...prevBoards];
          },
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
