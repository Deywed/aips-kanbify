import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { CardTag } from './card-tag.entity';
import { Board } from 'src/board/entity/board.entity';

@Entity('tags')
@Unique(['board', 'name'])
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Board, (board) => board.tags, { onDelete: 'CASCADE' })
  board: Board;

  @OneToMany(() => CardTag, (ct) => ct.tag)
  cards: CardTag[];
}
