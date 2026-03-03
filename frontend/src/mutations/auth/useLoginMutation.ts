import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import type { LoginSchemaType } from '@/pages/Login/schema/login.schema';

import { useBaseMutation } from '../useBaseMutation';

type LoginResponse = {
  accessToken: string;
  user: User;
};

export const useLoginMutation = () =>
  useBaseMutation<LoginResponse, Error, LoginSchemaType>(
    { path: API_ENDPOINTS.LOGIN },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
