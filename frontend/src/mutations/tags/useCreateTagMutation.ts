import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBoardActions } from '@/stores/board.store';

import type { Tag } from '@/types/board.types';

import { useBaseMutation } from '../useBaseMutation';

import type { TagSchemaType } from '@/pages/BoardDetails/components/board-filters/tagSchema';

export const useCreateTagMutation = (boardId: string) => {
  const { addTag } = useBoardActions();

  return useBaseMutation<Tag, Error, TagSchemaType>(
    { path: API_ENDPOINTS.ADD_TAG(boardId) },
    {
      onSuccess: addTag,
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
