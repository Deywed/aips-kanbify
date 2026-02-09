import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/config/appRoutes';
import { SOCKET_EVENTS } from '@/config/socketEvents';

import type {
  BoardMemberAddedPayload,
  BoardMemberRemovedPayload,
  BoardMemberRoleUpdatedPayload,
} from '@/types/socket-events.types';

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
      (payload: BoardMemberAddedPayload) => {
        addMember(payload.member);

        if (payload.actorId !== currentUser?.id) {
          toast.info(`@${payload.member.username} has been added to the board`);
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.MEMBER_REMOVED,
      (payload: BoardMemberRemovedPayload) => {
        removeMember(payload.member.id);

        if (payload.member.id === currentUser?.id) {
          return navigate(APP_ROUTES.BOARDS, { replace: true });
        }

        if (payload.actorId !== currentUser?.id) {
          toast.info(
            `@${payload.member.username} has been removed from the board`,
          );
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.MEMBER_ROLE_UPDATED,
      (payload: BoardMemberRoleUpdatedPayload) => {
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
