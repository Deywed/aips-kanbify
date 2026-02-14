import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Socket } from 'socket.io-client';
import { toast } from 'sonner';

import { APP_ROUTES } from '@/config/appRoutes';
import { SOCKET_EVENTS } from '@/config/socketEvents';

import { useBoardActions } from '@/stores/board.store';
import { useAuthUser } from '@/stores/auth.store';

import type {
  BoardMemberAddedPayload,
  BoardMemberRemovedPayload,
  BoardMemberRoleUpdatedPayload,
} from '@/types/socket-events.types';

import { useSocketSubscription } from '../useSocketSubscription';

const useBoardMemberEvent = (socket: Socket | null) => {
  const navigate = useNavigate();
  const { addMember, removeMember, updateMemberRole } = useBoardActions();
  const currentUser = useAuthUser();

  const handleMemberAdded = useCallback(
    (payload: BoardMemberAddedPayload) => {
      addMember(payload.member);

      if (payload.actorId !== currentUser?.id) {
        toast.info(`@${payload.member.username} has been added to the board`);
      }
    },
    [addMember, currentUser?.id],
  );

  const handleMemberRemoved = useCallback(
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
    [removeMember, currentUser?.id, navigate],
  );

  const handleMemberRoleUpdated = useCallback(
    (payload: BoardMemberRoleUpdatedPayload) => {
      updateMemberRole(
        payload.userId,
        payload.newRole,
        payload.userId === currentUser?.id,
      );
    },
    [updateMemberRole, currentUser?.id],
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.MEMBER_ADDED,
    handleMemberAdded,
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.MEMBER_REMOVED,
    handleMemberRemoved,
  );

  useSocketSubscription(
    socket,
    SOCKET_EVENTS.BOARD.MEMBER_ROLE_UPDATED,
    handleMemberRoleUpdated,
  );
};

export default useBoardMemberEvent;
