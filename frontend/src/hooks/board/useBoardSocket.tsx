import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { getUserFullName } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';
import { SOCKET_EVENTS } from '@/config/socketEvents';

import type { BoardMember } from '@/types/auth.types';
import type { BoardRole } from '@/types/board.types';

import {
  connectBoardSocket,
  disconnectBoardSocket,
  getBoardSocket,
  joinBoardRoom,
  leaveBoardRoom,
} from '@/lib/sockets/boardSocket';

import { useAccessToken, useAuthUser } from '@/stores/auth.store';
import { useBoardActions } from '@/stores/board.store';

export const useBoardSocket = (boardId?: string) => {
  const navigate = useNavigate();

  const token = useAccessToken();
  const currentUser = useAuthUser();

  const { addMember, removeMember, updateMemberRole } = useBoardActions();

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

    socket.on(
      SOCKET_EVENTS.BOARD.MEMBER_ADDED,
      (payload: { member: BoardMember; actorId: string }) => {
        addMember(payload.member);

        if (payload.actorId !== currentUser?.id) {
          toast.info(
            `${getUserFullName(payload.member)} has joined the board`,
            {
              position: 'bottom-right',
            },
          );
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.MEMBER_REMOVED,
      (payload: { userId: string }) => {
        removeMember(payload.userId);

        if (payload.userId === currentUser?.id) {
          navigate(APP_ROUTES.BOARDS, { replace: true });
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.MEMBER_ROLE_UPDATED,
      (payload: { userId: string; newRole: BoardRole }) => {
        updateMemberRole(
          payload.userId,
          payload.newRole,
          payload.userId === currentUser?.id,
        );
      },
    );

    return () => {
      leaveBoardRoom(boardId);
      const activeSocket = getBoardSocket();
      if (activeSocket) {
        activeSocket.off(SOCKET_EVENTS.BOARD.MEMBER_ADDED);
        activeSocket.off(SOCKET_EVENTS.BOARD.MEMBER_REMOVED);
        activeSocket.off(SOCKET_EVENTS.BOARD.MEMBER_ROLE_UPDATED);
        activeSocket.off('connect');
        activeSocket.off('disconnect');
        activeSocket.off('connect_error');
      }
      disconnectBoardSocket();
    };
  }, [
    token,
    boardId,
    removeMember,
    updateMemberRole,
    addMember,
    currentUser?.id,
    navigate,
  ]);
};
