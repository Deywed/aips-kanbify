import { useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import { useAuthActions } from '@/stores/auth.store';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();

  const { setUser } = useAuthActions();

  return useBaseMutation<User, Error, void>(
    {
      path: API_ENDPOINTS.USER_AVATAR,
      method: 'DELETE',
    },
    {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData<User>(
          [API_ENDPOINTS.USER(updatedUser.id)],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              avatarUrl: updatedUser.avatarUrl,
              avatarPublicId: updatedUser.avatarPublicId,
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BOARDS],
        });

        setUser(updatedUser);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
