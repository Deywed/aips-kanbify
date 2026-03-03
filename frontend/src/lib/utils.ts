import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { User } from '@/types/auth.types';
import type { BoardRole } from '@/types/board.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date().getTime();
  const diff = now - dateObj.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'few seconds ago';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;

  return `${years}y ago`;
}

export const getUserFullName = (user: User | null | undefined) => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`;
};

export const getAvatarFallback = (user: User | null | undefined) => {
  if (!user) return '';
  return user.firstName.charAt(0) + user.lastName.charAt(0);
};

export const roleToLabel = (role?: BoardRole) => {
  return role ? role.charAt(0) + role.slice(1).toLowerCase() : 'unknown';
};

export function getDirtyValues<T extends Record<string, unknown>>(
  dirtyFields: Partial<Record<keyof T, unknown>>,
  allValues: T,
): Partial<Record<keyof T, T[keyof T] | null>> {
  if (!dirtyFields || Object.keys(dirtyFields).length === 0) {
    return {};
  }

  return Object.keys(dirtyFields).reduce(
    (acc, key) => {
      if (dirtyFields[key as keyof T]) {
        const value = allValues[key as keyof T];
        acc[key as keyof T] = value !== undefined ? value : null;
      }
      return acc;
    },
    {} as Partial<Record<keyof T, T[keyof T] | null>>,
  );
}
