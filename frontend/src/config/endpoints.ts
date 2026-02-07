export const API_ENDPOINTS = {
  LOGIN: `/auth/login`,
  REGISTER: `/auth/register`,
  REFRESH_TOKEN: `/auth/refresh`,
  LOGOUT: `/auth/logout`,

  BOARDS: `/board`,
  BOARD: (boardId: string) => `/board/${boardId}`,
};
