import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';

import { SOCKET_EVENTS } from '@/config/socketEvents';

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
      const isChatOpen = useBoardStore.getState().isChatOpen;

      if (message.sender.id === currentUser?.id) {
        // Always append own messages
        appendMessage(message);
        return;
      }

      if (isChatOpen) {
        appendMessage(message);
      } else {
        incrementUnreadCount();
      }
    },
    [appendMessage, incrementUnreadCount, currentUser?.id],
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.CHAT_MESSAGE,
    handleChatMessage,
  );
};

export default useBoardChatEvent;
