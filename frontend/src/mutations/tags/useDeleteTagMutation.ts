import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBoardActions } from '@/stores/board.store';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteTagMutation = (boardId: string, tagId: string) => {
  const { deleteTag } = useBoardActions();

  return useBaseMutation<{ id: string }, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_TAG(boardId, tagId),
      method: 'DELETE',
    },
    {
      onSuccess: ({ id }) => {
        deleteTag(id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
