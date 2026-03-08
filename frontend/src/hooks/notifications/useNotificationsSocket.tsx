import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';
import { SOCKET_EVENTS } from '@/config/socketEvents';
import {
  connectNotificationsSocket,
  disconnectNotificationsSocket,
} from '@/lib/sockets/notificationsSocket';

import type { Notification } from '@/types/notification.types';

import { useAccessToken } from '@/stores/auth.store';
import { useNotificationsActions } from '@/stores/notifications.store';

import FloatingNotificationCard from '@/components/notifications/FloatingNotificationCard';

export const useNotificationsSocket = () => {
  const queryClient = useQueryClient();
  const token = useAccessToken();
  const { incrementUnread } = useNotificationsActions();

  const showNotificationToast = (notification: Notification) => {
    toast.custom(
      (id) => (
        <FloatingNotificationCard
          notification={notification}
          onDismiss={() => toast.dismiss(id)}
        />
      ),
      {
        duration: Infinity,
        position: 'top-center',
      },
    );
  };

  useEffect(() => {
    if (!token) return;

    const socket = connectNotificationsSocket(token);

    socket.on('connect', () => {
      console.log('Connected to notifications websocket', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notifications websocket');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socket.on(SOCKET_EVENTS.NOTIFICATIONS.NEW, (notification: Notification) => {
      incrementUnread();
      showNotificationToast(notification);

      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOARDS],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFICATIONS],
      });
    });

    return () => {
      disconnectNotificationsSocket();
    };
  }, [token, incrementUnread, queryClient]);
};
