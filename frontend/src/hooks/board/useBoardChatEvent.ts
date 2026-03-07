import { useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';

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
        if (boardId && currentUser) {
          chatStorage.updateLastSeenAt(
            boardId,
            currentUser.id,
            message.createdAt,
          );
        }
      } else {
        incrementUnreadCount();
        toast.message(`New message from @${message.sender.username}`, {
          description: message.content,
          descriptionClassName: 'line-clamp-2',
        });
      }
    },
    [currentUser, appendMessage, incrementUnreadCount],
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.CHAT_MESSAGE,
    handleChatMessage,
  );
};

export default useBoardChatEvent;
