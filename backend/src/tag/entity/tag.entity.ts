import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Board } from 'src/board/entity/board.entity';
import { Card } from 'src/card/entity/card.entity';

@Entity('tags')
@Unique(['board', 'name'])
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Board, (board) => board.tags, { onDelete: 'CASCADE' })
  board: Board;

  @ManyToMany(() => Card, (card) => card.tags)
  cards: Card[];
}
