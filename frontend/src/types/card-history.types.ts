import type { User } from './auth.types';

export type CardActionType = 'CREATED' | 'MOVED' | 'UPDATED' | 'ASSIGNED';

export type UpdatedPayload = {
  field: 'title' | 'description' | 'dueDate';
  oldValue: string | null;
  newValue: string | null;
};

export type MovedPayload = {
  fromColumnId: string;
  fromColumnName: string;
  toColumnId: string;
  toColumnName: string;
};

export type AssignedPayload = {
  oldAssigneeId: string | null;
  oldAssigneeName: string | null;
  newAssigneeId: string | null;
  newAssigneeName: string | null;
};

export type CardHistoryPayload =
  | MovedPayload
  | UpdatedPayload
  | AssignedPayload
  | null;

export type CardHistoryEntry = {
  id: string;
  action: CardActionType;
  payload: CardHistoryPayload;
  createdAt: string;
  actor: User;
};
