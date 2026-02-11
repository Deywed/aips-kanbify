import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBoardActions } from '@/stores/board.store';

import type { Column } from '@/types/board.types';

import { useBaseMutation } from '../useBaseMutation';

import type { NewColumnSchemaType } from '@/pages/BoardDetails/components/column/newColumn.schema';

export const useCreateColumnMutation = (boardId: string) => {
  const { addColumn } = useBoardActions();

  return useBaseMutation<Column, Error, NewColumnSchemaType>(
    { path: API_ENDPOINTS.BOARD_COLUMNS(boardId) },
    {
      onSuccess: addColumn,
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
