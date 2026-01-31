import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Board } from 'src/board/entity/board.entity';
import { Card } from 'src/card/entity/card.entity';

@Entity('board_columns')
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('numeric', { precision: 10, scale: 5 })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
  board: Board;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];
}
