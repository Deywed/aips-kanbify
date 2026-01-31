import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { CardTag } from './card-tag.entity';

@Entity('tags')
@Unique(['name'])
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => CardTag, (ct) => ct.tag)
  cards: CardTag[];
}
