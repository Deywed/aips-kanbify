import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useNotificationsActions } from '@/stores/notifications.store';
import { useNotificationsSocket } from './useNotificationsSocket';

export const useInitNotifications = () => {
  useNotificationsSocket(); // Init websocket connection

  const { setUnreadCount } = useNotificationsActions();

  const { data, isSuccess } = useQuery<number>({
    queryKey: [API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT],
  });

  useEffect(() => {
    if (!isSuccess || data == null) return;
    setUnreadCount(data);
  }, [isSuccess, data, setUnreadCount]);
};
