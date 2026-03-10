import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/users/entity/user.entity';

@Entity('chat_messages')
@Index('IDX_chat_messages_board_createdAt', ['board', 'createdAt'])
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  board: Board;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;
}
