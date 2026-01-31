import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BoardMember } from 'src/board-members/entity/board-members.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BoardMember, (bm) => bm.board)
  members: BoardMember[];
}
