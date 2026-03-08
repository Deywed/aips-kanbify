import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Board } from 'src/board/entity/board.entity';
import { Card } from 'src/card/entity/card.entity';
import { User } from 'src/users/entity/user.entity';

export enum NotificationType {
  BOARD_MEMBER_ADDED = 'BOARD_MEMBER_ADDED',
  BOARD_MEMBER_REMOVED = 'BOARD_MEMBER_REMOVED',
  BOARD_MEMBER_ROLE_UPDATED = 'BOARD_MEMBER_ROLE_UPDATED',
  CARD_ASSIGNED = 'CARD_ASSIGNED',
  CARD_MOVED = 'CARD_MOVED',
  CARD_UPDATED = 'CARD_UPDATED',
}

@Entity('notifications')
@Index('IDX_notifications_user_createdAt', ['user', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'jsonb', nullable: true })
  payload?: any;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  triggeredBy: User;

  @ManyToOne(() => Card, { nullable: true, onDelete: 'CASCADE' })
  card?: Card;

  @ManyToOne(() => Board, { nullable: true, onDelete: 'CASCADE' })
  board?: Board;
}
