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

export function getDirtyValues<T extends Record<string, unknown>>(
  dirtyFields: Partial<Record<keyof T, unknown>>,
  allValues: T,
): Partial<T> {
  if (!dirtyFields || Object.keys(dirtyFields).length === 0) {
    return {};
  }

  return Object.keys(dirtyFields).reduce((acc, key) => {
    if (dirtyFields[key as keyof T]) {
      acc[key as keyof T] = allValues[key as keyof T];
    }
    return acc;
  }, {} as Partial<T>);
}
