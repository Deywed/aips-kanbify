import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/config/appRoutes';
import { SOCKET_EVENTS } from '@/config/socketEvents';

import type {
  BoardColumnAddedPayload,
  BoardColumnRemovedPayload,
  BoardColumnUpdatedPayload,
  BoardMemberAddedPayload,
  BoardMemberRemovedPayload,
  BoardMemberRoleUpdatedPayload,
  BoardTagAddedPayload,
  BoardTagRemovedPayload,
  BoardTagUpdatedPayload,
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

  const {
    addMember,
    removeMember,
    updateMemberRole,
    addColumn,
    removeColumn,
    updateColumnTitle,
    addTag,
    deleteTag,
    updateTag,
  } = useBoardActions();

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

    socket.on(
      SOCKET_EVENTS.BOARD.COLUMN_ADDED,
      (payload: BoardColumnAddedPayload) => {
        if (payload.actorId !== currentUser?.id) {
          addColumn(payload.column);
          toast.info(`Column "${payload.column.title}" has been added`);
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.COLUMN_REMOVED,
      (payload: BoardColumnRemovedPayload) => {
        if (payload.actorId !== currentUser?.id) removeColumn(payload.columnId);
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.COLUMN_UPDATED,
      (payload: BoardColumnUpdatedPayload) => {
        if (payload.actorId !== currentUser?.id)
          updateColumnTitle(payload.columnId, payload.title);
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.TAG_ADDED,
      (payload: BoardTagAddedPayload) => {
        if (payload.actorId !== currentUser?.id) {
          addTag(payload.tag);
          toast.info(`Tag "${payload.tag.name}" has been added`);
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.TAG_REMOVED,
      (payload: BoardTagRemovedPayload) => {
        if (payload.actorId !== currentUser?.id) {
          deleteTag(payload.tagId);
        }
      },
    );

    socket.on(
      SOCKET_EVENTS.BOARD.TAG_UPDATED,
      (payload: BoardTagUpdatedPayload) => {
        if (payload.actorId !== currentUser?.id) {
          updateTag(payload.tagId, payload.name);
        }
      },
    );

    return () => {
      leaveBoardRoom(boardId);
      const activeSocket = getBoardSocket();
      if (activeSocket) {
        activeSocket.off(SOCKET_EVENTS.BOARD.MEMBER_ADDED);
        activeSocket.off(SOCKET_EVENTS.BOARD.MEMBER_REMOVED);
        activeSocket.off(SOCKET_EVENTS.BOARD.MEMBER_ROLE_UPDATED);
        activeSocket.off(SOCKET_EVENTS.BOARD.COLUMN_ADDED);
        activeSocket.off(SOCKET_EVENTS.BOARD.COLUMN_REMOVED);
        activeSocket.off(SOCKET_EVENTS.BOARD.COLUMN_UPDATED);
        activeSocket.off(SOCKET_EVENTS.BOARD.TAG_ADDED);
        activeSocket.off(SOCKET_EVENTS.BOARD.TAG_REMOVED);
        activeSocket.off(SOCKET_EVENTS.BOARD.TAG_UPDATED);
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
    addColumn,
    removeColumn,
    updateColumnTitle,
    addTag,
    deleteTag,
    updateTag,
  ]);
};
