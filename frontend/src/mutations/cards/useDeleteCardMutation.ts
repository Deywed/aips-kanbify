import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBoardActions, useBoardInfo } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteCardMutation = (columnId: string, cardId: string) => {
  const { deleteCard } = useBoardActions();
  const boardInfo = useBoardInfo();

  return useBaseMutation<{ id: string }, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_CARD(boardInfo?.id || '', columnId, cardId),
      method: 'DELETE',
    },
    {
      onSuccess: ({ id }) => {
        deleteCard(columnId, id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
