import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Card } from '@/types/board.types';
import type { CardSchemaType } from '@/pages/BoardDetails/components/cards/newCard.schema';

import { useBoardActions, useBoardInfo } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

export const useCreateCardMutation = (columnId: string) => {
  const boardInfo = useBoardInfo();
  const { addCard } = useBoardActions();

  const queryClient = useQueryClient();

  return useBaseMutation<Card, Error, CardSchemaType>(
    { path: API_ENDPOINTS.CREATE_CARD(boardInfo.id!, columnId) },
    {
      onSuccess: (data) => {
        addCard(columnId, data);

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
