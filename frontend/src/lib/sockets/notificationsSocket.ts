import { API_BASE_URL } from '@/lib/axios';
import { createSocketManager } from '@/lib/sockets/createSocketManager';

const notificationsSocketManager = createSocketManager({
  baseUrl: API_BASE_URL,
  namespace: '/notifications',
  options: {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
});

export const connectNotificationsSocket = (token: string) =>
  notificationsSocketManager.connect({ auth: { token } });

export const disconnectNotificationsSocket = () =>
  notificationsSocketManager.disconnect();

export const emitNotificationsEvent = <T>(event: string, payload: T) =>
  notificationsSocketManager.emit(event, payload);

export const getNotificationsSocket = () =>
  notificationsSocketManager.getSocket();
