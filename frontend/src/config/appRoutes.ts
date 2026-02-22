export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  BOARDS: `/boards`,
  BOARD_DETAILS: (boardId: string) => `/boards/${boardId}`,

  NOTIFICATIONS: '/notifications',

  USERS: '/users',
  USER_DETAILS: (userId: string) => `/users/${userId}`,

  CARD_DETAILS: (boardId: string, cardId: string) =>
    `/boards/${boardId}?card=${cardId}`,
};
