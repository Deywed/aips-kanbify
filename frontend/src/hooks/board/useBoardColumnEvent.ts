import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';

import { SOCKET_EVENTS } from '@/config/socketEvents';

import { useBoardActions } from '@/stores/board.store';
import { useAuthUser } from '@/stores/auth.store';

import type {
  BoardColumnAddedPayload,
  BoardColumnRemovedPayload,
  BoardColumnReorderedPayload,
  BoardColumnUpdatedPayload,
} from '@/types/socket-events.types';

import { useSocketSubscription } from '../useSocketSubscription';

const useBoardColumnEvent = (socket: Socket | null) => {
  const { addColumn, removeColumn, updateColumnTitle, reorderColumn } =
    useBoardActions();
  const currentUser = useAuthUser();

  const handleColumnAdded = useCallback(
    (payload: BoardColumnAddedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        addColumn(payload.column);
        toast.info(`Column "${payload.column.title}" has been added`);
      }
    },
    [addColumn, currentUser?.id],
  );

  const handleColumnRemoved = useCallback(
    (payload: BoardColumnRemovedPayload) => {
      if (payload.actorId !== currentUser?.id) removeColumn(payload.columnId);
    },
    [removeColumn, currentUser?.id],
  );

  const handleColumnUpdated = useCallback(
    (payload: BoardColumnUpdatedPayload) => {
      if (payload.actorId !== currentUser?.id)
        updateColumnTitle(payload.columnId, payload.title);
    },
    [updateColumnTitle, currentUser?.id],
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.COLUMN_ADDED,
    handleColumnAdded,
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.COLUMN_REMOVED,
    handleColumnRemoved,
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.COLUMN_UPDATED,
    handleColumnUpdated,
  );

  const handleColumnReordered = useCallback(
    (payload: BoardColumnReorderedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        reorderColumn(payload.columnId, payload.newPosition);
      }
    },
    [reorderColumn, currentUser?.id],
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.COLUMN_REORDERED,
    handleColumnReordered,
  );
};

export default useBoardColumnEvent;
