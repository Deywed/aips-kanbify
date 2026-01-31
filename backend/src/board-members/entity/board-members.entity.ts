import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/users/entity/user.entity';

export enum BoardRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity('board_members')
@Unique(['board', 'user'])
export class BoardMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: BoardRole })
  role: BoardRole;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Board, (board) => board.members, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  user: User;
}
