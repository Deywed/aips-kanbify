export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  BOARDS: `/boards`,
  NOTIFICATIONS: '/notifications',
  USERS: '/users',
  USER_DETAILS: (userId: string) => `/users/${userId}`,
};
