import {
  Column,
  CreateDateColumn,
  Entity,
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
  TAG_ADDED = 'TAG_ADDED',
  TAG_REMOVED = 'TAG_REMOVED',
}

@Entity('card_history')
export class CardHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: CardActionType })
  action: CardActionType;

  @Column({ type: 'jsonb', nullable: true })
  payload?: any; // { fromColumnId, toColumnId, oldValue, newValue }

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Card, (card) => card.history, { onDelete: 'CASCADE' })
  card: Card;

  @ManyToOne(() => User)
  actor: User;
}
