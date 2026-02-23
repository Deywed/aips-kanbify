import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';

import { SOCKET_EVENTS } from '@/config/socketEvents';

import { useBoardActions } from '@/stores/board.store';
import { useAuthUser } from '@/stores/auth.store';

import type {
  CardAddedPayload,
  CardDeletedPayload,
  CardUpdatedPayload,
} from '@/types/socket-events.types';

import { useSocketSubscription } from '../useSocketSubscription';

const useBoardColumnCardEvent = (socket: Socket | null) => {
  const { addCard, updateCard, deleteCard } = useBoardActions();
  const currentUser = useAuthUser();

  const handleCardAdded = useCallback(
    (payload: CardAddedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        addCard(payload.columnId, payload.card);
        toast.info(`Card "${payload.card.title}" has been added`);
      }
    },
    [addCard, currentUser?.id],
  );

  const handleCardUpdated = useCallback(
    (payload: CardUpdatedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        updateCard(payload.columnId, payload.card.id, payload.card);
      }
    },
    [currentUser?.id, updateCard],
  );

  const handleCardDeleted = useCallback(
    (payload: CardDeletedPayload) => {
      if (payload.actorId !== currentUser?.id) {
        deleteCard(payload.columnId, payload.cardId);
      }
    },
    [currentUser?.id, deleteCard],
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.COLUMN_CARD_CREATED,
    handleCardAdded,
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.COLUMN_CARD_UPDATED,
    handleCardUpdated,
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.COLUMN_CARD_DELETED,
    handleCardDeleted,
  );
};

export default useBoardColumnCardEvent;
