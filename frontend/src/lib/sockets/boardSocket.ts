import { API_BASE_URL } from '@/lib/axios';
import { createSocketManager } from '@/lib/sockets/createSocketManager';
import { SOCKET_EVENTS } from '@/config/socketEvents';

const boardSocketManager = createSocketManager({
  baseUrl: API_BASE_URL,
  namespace: '/boards',
  options: {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
});

export const connectBoardSocket = (token: string) =>
  boardSocketManager.connect({ auth: { token } });

export const disconnectBoardSocket = () => boardSocketManager.disconnect();

export const joinBoardRoom = (boardId: string) =>
  boardSocketManager.emit(SOCKET_EVENTS.BOARD.JOIN, { boardId });

export const leaveBoardRoom = (boardId: string) =>
  boardSocketManager.emit(SOCKET_EVENTS.BOARD.LEAVE, { boardId });

export const getBoardSocket = () => boardSocketManager.getSocket();
