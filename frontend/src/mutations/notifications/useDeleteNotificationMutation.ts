import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { Notification } from '@/types/notification.types';

import { useBaseMutation } from '../useBaseMutation';

export const useDeleteNotificationMutation = (notificationId: string) => {
  const queryClient = useQueryClient();

  return useBaseMutation<Notification, Error, void>(
    {
      path: API_ENDPOINTS.DELETE_NOTIFICATION(notificationId),
      method: 'DELETE',
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.NOTIFICATIONS],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    },
  );
};
