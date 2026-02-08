import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

import { API_BASE_URL } from '@/lib/axios';
import { SOCKET_EVENTS } from '@/config/socketEvents';

import { useAccessToken } from '@/stores/auth.store';
import { useNotificationsActions } from '@/stores/notifications.store';

export const useNotificationsSocket = () => {
  const queryClient = useQueryClient();

  const token = useAccessToken();
  const { incrementUnread } = useNotificationsActions();

  const socketRef = useRef<Socket | null>(null);

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

    socket.on(SOCKET_EVENTS.NOTIFICATIONS.NEW, (notification) => {
      incrementUnread();
      console.log(notification);
      // TODO: Show toast for new notification based on type
      // showNotificationToast(notification);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, incrementUnread, queryClient]);
};
