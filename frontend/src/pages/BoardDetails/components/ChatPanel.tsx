import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, SentIcon } from '@hugeicons/core-free-icons';

import api from '@/lib/axios';
import { sendChatMessage } from '@/lib/sockets/boardSocket';
import { formatRelativeDate } from '@/lib/utils';

import { API_ENDPOINTS } from '@/config/endpoints';

import {
  useBoardActions,
  useBoardInfo,
  useChatMessages,
  useChatHasMore,
} from '@/stores/board.store';
import { useAuthUser } from '@/stores/auth.store';

import type { ChatMessage } from '@/types/chat.types';

import H4 from '@/components/ui/typography/H4';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

import UserAvatar from '@/components/common/UserAvatar';
import EmptyState from '@/components/common/EmptyState';
import { useQuery } from '@tanstack/react-query';

const CHAT_MESSAGES_LIMIT = 15;

const ChatPanel = ({ onClose }: { onClose: () => void }) => {
  const boardInfo = useBoardInfo();
  const messages = useChatMessages();
  const hasMore = useChatHasMore();
  const { setMessages, prependMessages, setHasMore } = useBoardActions();
  const currentUser = useAuthUser();

  const [input, setInput] = useState('');
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSentinelActive, setIsSentinelActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isLoadingOlderRef = useRef(false);
  const hasScrolledRef = useRef(false);

  const boardId = boardInfo.id;

  const loadOlder = useCallback(async () => {
    if (
      !boardId ||
      !hasMore ||
      isLoadingOlderRef.current ||
      messages.length === 0
    )
      return;

    const oldestMessage = messages[0];
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    const prevScrollHeight = viewport?.scrollHeight ?? 0;

    isLoadingOlderRef.current = true;
    setIsLoadingOlder(true);

    try {
      const { data } = await api.get<ChatMessage[]>(
        API_ENDPOINTS.CHAT_MESSAGES(boardId),
        {
          params: {
            limit: CHAT_MESSAGES_LIMIT,
            before: oldestMessage.createdAt,
          },
        },
      );

      const older = data.reverse();
      prependMessages(older);
      setHasMore(data.length === CHAT_MESSAGES_LIMIT);

      requestAnimationFrame(() => {
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight - prevScrollHeight;
        }
      });
    } finally {
      isLoadingOlderRef.current = false;
      setIsLoadingOlder(false);
    }
  }, [boardId, hasMore, messages, prependMessages, setHasMore]);

  const { ref: topSentinelRef } = useInView({
    threshold: 0,
    skip: !isSentinelActive,
    onChange: (inView) => {
      if (inView) loadOlder();
    },
  });

  const { data: initialMessages, isLoading: isInitialLoad } = useQuery<
    ChatMessage[]
  >({
    queryKey: [
      API_ENDPOINTS.CHAT_MESSAGES(boardId!),
      {
        limit: CHAT_MESSAGES_LIMIT,
      },
    ],
    enabled: !!boardId,
    staleTime: Infinity, // ne refetchuj, socket drži svježe
  });

  useEffect(() => {
    if (!initialMessages) return;
    setMessages(initialMessages.slice().reverse());
    setHasMore(initialMessages.length === CHAT_MESSAGES_LIMIT);
  }, [initialMessages, setMessages, setHasMore]);

  // Scroll + sentinel aktivacija — okida se kada messages prvi put budu popunjeni
  useEffect(() => {
    if (messages.length === 0 || hasScrolledRef.current) return;
    hasScrolledRef.current = true;

    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });

    const timeout = setTimeout(() => setIsSentinelActive(true), 100);
    return () => clearTimeout(timeout);
  }, [messages.length]);

  // Scroll za nove real-time poruke
  useEffect(() => {
    if (!isSentinelActive) return;

    const viewport = scrollAreaRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!viewport) return;

    const isNearBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 100;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSentinelActive, messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !boardId) return;
    sendChatMessage(boardId, trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-background flex h-full w-84 shrink-0 flex-col border-l">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <H4>Chat</H4>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <HugeiconsIcon icon={Cancel01Icon} />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="min-h-0 flex-1">
        <div className="flex h-full flex-col gap-2 p-4">
          {hasMore && isSentinelActive && (
            <div ref={topSentinelRef} className="h-1" />
          )}

          {isLoadingOlder && (
            <div className="flex justify-center py-2">
              <Spinner />
            </div>
          )}

          {isInitialLoad ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              title="No messages yet"
              description="Start the conversation!"
            />
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender.id === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  {!isOwn && <UserAvatar user={msg.sender} size={6} link />}
                  <div
                    className={`flex max-w-[75%] flex-col ${isOwn ? 'items-end' : ''}`}
                  >
                    {!isOwn && (
                      <span className="text-muted-foreground mb-0.5 text-xs">
                        {msg.sender.firstName} {msg.sender.lastName}
                      </span>
                    )}
                    <div
                      className={`rounded-lg px-3 py-1.5 text-sm wrap-break-word ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-muted-foreground mt-0.5 text-[10px]">
                      {formatRelativeDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form className="flex items-center gap-2 border-t p-4">
        <Input
          placeholder="Type a message..."
          className="flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={2000}
        />
        <Button
          size="icon"
          variant="outline"
          type="submit"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <HugeiconsIcon icon={SentIcon} />
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;
