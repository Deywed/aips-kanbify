import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';

import { SOCKET_EVENTS } from '@/config/socketEvents';

import { chatStorage } from '@/lib/chatStorage';

import { useBoardActions } from '@/stores/board.store';
import { useAuthUser } from '@/stores/auth.store';
import { useBoardStore } from '@/stores/board.store';

import type { ChatMessage } from '@/types/chat.types';

import { useSocketSubscription } from '../useSocketSubscription';

const useBoardChatEvent = (socket: Socket | null) => {
  const { appendMessage, incrementUnreadCount } = useBoardActions();
  const currentUser = useAuthUser();

  const handleChatMessage = useCallback(
    (message: ChatMessage) => {
      const { isChatOpen, board } = useBoardStore.getState();
      const boardId = board?.id;

      if (message.sender.id === currentUser?.id) {
        // Always append own messages
        appendMessage(message);
        // Update lastSeen so own messages don't count as unread on refresh
        if (boardId && currentUser) {
          chatStorage.updateLastSeenAt(
            boardId,
            currentUser.id,
            message.createdAt,
          );
        }
        return;
      }

      if (isChatOpen) {
        appendMessage(message);
        // Update lastSeen while reading in real-time
        if (boardId && currentUser) {
          chatStorage.updateLastSeenAt(
            boardId,
            currentUser.id,
            message.createdAt,
          );
        }
      } else {
        incrementUnreadCount();
      }
    },
    [appendMessage, incrementUnreadCount, currentUser],
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.CHAT_MESSAGE,
    handleChatMessage,
  );
};

export default useBoardChatEvent;
