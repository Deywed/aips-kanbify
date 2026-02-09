import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

import { API_BASE_URL } from '@/lib/axios';
import { SOCKET_EVENTS } from '@/config/socketEvents';

import type { Notification } from '@/types/notification.types';

import { useAccessToken } from '@/stores/auth.store';
import { useNotificationsActions } from '@/stores/notifications.store';

import FloatingNotificationCard from '@/components/notifications/FloatingNotificationCard';

export const useNotificationsSocket = () => {
  const queryClient = useQueryClient();

  const token = useAccessToken();
  const { incrementUnread } = useNotificationsActions();

  const socketRef = useRef<Socket | null>(null);

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

    const socket = io(`${API_BASE_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

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
    });

    return () => {
      socket.disconnect();
    };
  }, [token, incrementUnread, queryClient]);
};
