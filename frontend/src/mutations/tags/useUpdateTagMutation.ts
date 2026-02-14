import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Tag } from '@/types/board.types';

import { useBoardActions } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

import type { TagSchemaType } from '@/pages/BoardDetails/components/board-filters/tagSchema';

export const useUpdateTagMutation = (boardId: string, tagId: string) => {
  const { updateTag } = useBoardActions();

  return useBaseMutation<Tag, Error, Partial<TagSchemaType>>(
    { path: API_ENDPOINTS.UPDATE_TAG(boardId, tagId), method: 'PATCH' },
    {
      onSuccess: (updatedTag) => {
        updateTag(updatedTag.id, updatedTag.name);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
