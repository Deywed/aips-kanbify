import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import api, { getApiErrorMessage } from '@/lib/axios';

import type { Column } from '@/types/board.types';

import { useBoardActions, useBoardInfo } from '@/stores/board.store';

type ReorderColumnVariables = {
  columnId: string;
  afterId?: string | null;
};

export const useReorderColumnMutation = () => {
  const boardInfo = useBoardInfo();
  const { reorderColumn } = useBoardActions();

  return useMutation<Column, Error, ReorderColumnVariables>({
    mutationFn: async ({ columnId, afterId }) => {
      try {
        const response = await api.patch<Column>(
          API_ENDPOINTS.REORDER_COLUMN(boardInfo.id!, columnId),
          { afterId },
        );
        return response.data;
      } catch (error) {
        const message = getApiErrorMessage(error);
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      reorderColumn(data.id, data.position);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
