import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { BoardColumn } from 'src/board-column/entity/board-column.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BoardMember, (bm) => bm.board)
  members: BoardMember[];

  @OneToMany(() => BoardColumn, (col) => col.board)
  columns: BoardColumn[];
}
