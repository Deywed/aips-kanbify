export const SOCKET_EVENTS = {
  NOTIFICATIONS: {
    NEW: 'notification:new',
  },
  BOARD: {
    JOIN: 'board:join',
    LEAVE: 'board:leave',
    MEMBER_ADDED: 'board:memberAdded',
    MEMBER_REMOVED: 'board:memberRemoved',
    MEMBER_ROLE_UPDATED: 'board:memberRoleUpdated',
  },
} as const;
