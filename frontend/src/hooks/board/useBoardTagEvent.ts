import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';

import { SOCKET_EVENTS } from '@/config/socketEvents';

import { useBoardActions } from '@/stores/board.store';
import { useAuthUser } from '@/stores/auth.store';

import type {
  BoardTagAddedPayload,
  BoardTagRemovedPayload,
  BoardTagUpdatedPayload,
} from '@/types/socket-events.types';

import { useSocketSubscription } from '../useSocketSubscription';

const useBoardTagEvent = (socket: Socket | null) => {
  const { addTag, deleteTag, updateTag } = useBoardActions();
  const currentUser = useAuthUser();

  const handleTagAdded = useCallback(
    (payload: BoardTagAddedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        addTag(payload.tag);
        toast.info(`Tag "${payload.tag.name}" has been added`);
      }
    },
    [addTag, currentUser?.id],
  );

  const handleTagRemoved = useCallback(
    (payload: BoardTagRemovedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        deleteTag(payload.tagId);
      }
    },
    [deleteTag, currentUser?.id],
  );

  const handleTagUpdated = useCallback(
    (payload: BoardTagUpdatedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        updateTag(payload.tagId, payload.name);
      }
    },
    [updateTag, currentUser?.id],
  );

  useSocketSubscription(socket, SOCKET_EVENTS.BOARD.TAG_ADDED, handleTagAdded);

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.TAG_REMOVED,
    handleTagRemoved,
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.TAG_UPDATED,
    handleTagUpdated,
  );
};

export default useBoardTagEvent;
