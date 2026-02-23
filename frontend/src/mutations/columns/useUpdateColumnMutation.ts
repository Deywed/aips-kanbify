import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Column } from '@/types/board.types';

import { useBoardActions } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

import type { UpdateColumnPayload } from '@/pages/BoardDetails/components/column/newColumn.schema';

export const useUpdateColumnMutation = (boardId: string, columnId: string) => {
  const { updateColumnTitle } = useBoardActions();

  return useBaseMutation<Column, Error, UpdateColumnPayload>(
    { path: API_ENDPOINTS.BOARD_COLUMN(boardId, columnId), method: 'PATCH' },
    {
      onSuccess: (updatedColumn) => {
        updateColumnTitle(updatedColumn.id, updatedColumn.title);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
