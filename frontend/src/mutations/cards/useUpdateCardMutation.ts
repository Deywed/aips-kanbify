import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Card } from '@/types/board.types';
import type { CardUpdatePayload } from '@/pages/BoardDetails/components/cards/newCard.schema';

import { useBoardActions, useBoardInfo } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

export const useUpdateCardMutation = (columnId: string, cardId: string) => {
  const boardInfo = useBoardInfo();
  const { updateCard } = useBoardActions();

  const queryClient = useQueryClient();

  return useBaseMutation<Card, Error, CardUpdatePayload>(
    {
      path: API_ENDPOINTS.UPDATE_CARD(boardInfo.id!, columnId, cardId),
      method: 'PATCH',
    },
    {
      onSuccess: (data) => {
        updateCard(columnId, cardId, data);

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.ASSIGNED_CARDS],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
