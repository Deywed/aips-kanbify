export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  LOGOUT: '/auth/logout',

  USERS: '/users',
  USERS_SEARCH: '/users/search',

  BOARDS: '/board',
  BOARD: (boardId: string) => `/board/${boardId}`,

  ADD_BOARD_MEMBER: (boardId: string) => `/board/${boardId}/members`,
};
