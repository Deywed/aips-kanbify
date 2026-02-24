export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',

  USERS: '/users',
  USERS_SEARCH: '/users/search',

  BOARDS: '/board',
  BOARD: (boardId: string) => `/board/${boardId}`,

  BOARD_COLUMNS: (boardId: string) => `/board/${boardId}/columns`,
  BOARD_COLUMN: (boardId: string, columnId: string) =>
    `/board/${boardId}/columns/${columnId}`,

  ADD_BOARD_MEMBER: (boardId: string) => `/board/${boardId}/members`,
  DELETE_BOARD_MEMBER: (boardId: string, userId: string) =>
    `/board/${boardId}/members/${userId}`,
  UPDATE_BOARD_MEMBER_ROLE: (boardId: string, userId: string) =>
    `/board/${boardId}/members/${userId}/role`,

  ADD_TAG: (boardId: string) => `/board/${boardId}/tags`,
  DELETE_TAG: (boardId: string, tagId: string) =>
    `/board/${boardId}/tags/${tagId}`,
  UPDATE_TAG: (boardId: string, tagId: string) =>
    `/board/${boardId}/tags/${tagId}`,

  CREATE_CARD: (boardId: string, columnId: string) =>
    `/board/${boardId}/columns/${columnId}/cards`,
  UPDATE_CARD: (boardId: string, columnId: string, cardId: string) =>
    `/board/${boardId}/columns/${columnId}/cards/${cardId}`,
  DELETE_CARD: (boardId: string, columnId: string, cardId: string) =>
    `/board/${boardId}/columns/${columnId}/cards/${cardId}`,
  MOVE_CARD: (boardId: string, columnId: string, cardId: string) =>
    `/board/${boardId}/columns/${columnId}/cards/${cardId}/move`,

  NOTIFICATIONS_UNREAD_COUNT: '/notifications/unread-count',
};
