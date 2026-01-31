import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Card } from 'src/card/entity/card.entity';
import { Tag } from './tag.entity';

@Entity('card_tags')
@Unique(['card', 'tag'])
export class CardTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Card, (card) => card.tags, { onDelete: 'CASCADE' })
  card: Card;

  @ManyToOne(() => Tag, (tag) => tag.cards, { onDelete: 'CASCADE' })
  tag: Tag;
}
