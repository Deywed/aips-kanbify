import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import api, { getApiErrorMessage } from '@/lib/axios';

import type { Card } from '@/types/board.types';

import { useBoardActions, useBoardInfo } from '@/stores/board.store';

type MoveCardVariables = {
  sourceColumnId: string;
  cardId: string;
  newColumnId: string;
  afterCardId?: string | null;
};

export const useMoveCardMutation = () => {
  const boardInfo = useBoardInfo();
  const { moveCard } = useBoardActions();

  return useMutation<Card, Error, MoveCardVariables>({
    mutationFn: async ({
      sourceColumnId,
      cardId,
      newColumnId,
      afterCardId,
    }) => {
      try {
        const response = await api.patch<Card>(
          API_ENDPOINTS.MOVE_CARD(boardInfo.id!, sourceColumnId, cardId),
          { newColumnId, afterCardId },
        );
        return response.data;
      } catch (error) {
        const message = getApiErrorMessage(error);
        throw new Error(message);
      }
    },
    onSuccess: (movedCard, variables) => {
      moveCard(
        variables.sourceColumnId,
        variables.newColumnId,
        variables.cardId,
        movedCard,
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
