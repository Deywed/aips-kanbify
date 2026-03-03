import { useEffect } from 'react';

import {
  connectBoardSocket,
  disconnectBoardSocket,
  getBoardSocket,
  joinBoardRoom,
  leaveBoardRoom,
} from '@/lib/sockets/boardSocket';

import { useAccessToken } from '@/stores/auth.store';

import useBoardColumnEvent from './useBoardColumnEvent';
import useBoardMemberEvent from './useBoardMemberEvent';
import useBoardTagEvent from './useBoardTagEvent';
import useBoardColumnCardEvent from './useBoardColumnCardEvent';

export const useBoardSocket = (boardId?: string) => {
  const token = useAccessToken();

  const socket = getBoardSocket();

  useBoardMemberEvent(socket);
  useBoardColumnEvent(socket);
  useBoardTagEvent(socket);
  useBoardColumnCardEvent(socket);

  useEffect(() => {
    if (!token || !boardId) return;

    const socket = connectBoardSocket(token);

    socket.on('connect', () => {
      joinBoardRoom(boardId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from board websocket');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      leaveBoardRoom(boardId);
      const activeSocket = getBoardSocket();
      if (activeSocket) {
        activeSocket.off('connect');
        activeSocket.off('disconnect');
        activeSocket.off('connect_error');
      }
      disconnectBoardSocket();
    };
  }, [token, boardId]);
};
