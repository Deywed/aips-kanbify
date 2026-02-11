import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBoardActions } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteColumnMutation = (boardId: string, columnId: string) => {
  const { removeColumn } = useBoardActions();

  return useBaseMutation<{ id: string }, Error, void>(
    {
      path: API_ENDPOINTS.BOARD_COLUMN(boardId, columnId),
      method: 'DELETE',
    },
    {
      onSuccess: ({ id }) => {
        removeColumn(id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
