import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { User } from '@/types/auth.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserFullName = (user: User) =>
  `${user.firstName} ${user.lastName}`;

export const getAvatarFallback = (user: User) =>
  user.firstName.charAt(0) + user.lastName.charAt(0);
