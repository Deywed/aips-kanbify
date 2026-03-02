import { useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import { useBaseMutation } from '../useBaseMutation';

import type { UserInfoSchemaType } from '@/pages/Profile/schema/userInfo.schema';

export const useEditProfileInfoMutation = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<User, Error, UserInfoSchemaType>(
    {
      path: API_ENDPOINTS.USERS,
      method: 'PATCH',
    },

    {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData<User>(
          [API_ENDPOINTS.USER(updatedUser.id)],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              firstName: updatedUser.firstName,
              lastName: updatedUser.lastName,
              bio: updatedUser.bio,
            };
          },
        );

        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.BOARDS],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
