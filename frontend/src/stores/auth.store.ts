import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import type { User } from '@/types/auth.types';

type AuthState = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAccessToken: (token) => set({ accessToken: token }),

      setUser: (user) => set({ user }),

      logout: () => {
        set({ accessToken: null, user: null });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);

export const useAuthUser = () => useAuthStore((state) => state.user);

export const useAccessToken = () => useAuthStore((state) => state.accessToken);

export const useIsAuthenticated = () =>
  useAuthStore((state) => Boolean(state.accessToken));

export const useAuthActions = () =>
  useAuthStore(
    useShallow((state) => ({
      setAccessToken: state.setAccessToken,
      setUser: state.setUser,
      logout: state.logout,
    })),
  );
