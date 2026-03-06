import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from 'src/card/entity/card.entity';
import { User } from 'src/users/entity/user.entity';

export enum CardActionType {
  CREATED = 'CREATED',
  MOVED = 'MOVED',
  UPDATED = 'UPDATED',
  ASSIGNED = 'ASSIGNED',
}

export type MovedPayload = {
  fromColumnId: string;
  fromColumnName: string;
  toColumnId: string;
  toColumnName: string;
};

export type UpdatedPayload = {
  field: 'title' | 'description' | 'dueDate';
  oldValue: string | null;
  newValue: string | null;
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

@Entity('card_history')
export class CardHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CardActionType })
  action: CardActionType;

  @Column({ type: 'jsonb', nullable: true })
  payload: CardHistoryPayload;

  @CreateDateColumn()
  createdAt: Date;

  @Index()
  @ManyToOne(() => Card, (card) => card.history, { onDelete: 'CASCADE' })
  card: Card;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', eager: true })
  actor: User | null;
}
