import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BoardColumn } from 'src/board-column/entity/board-column.entity';
import { User } from 'src/users/entity/user.entity';
import { CardHistory } from 'src/card-history/entity/card-history.entity';
import { Tag } from 'src/tag/entity/tag.entity';

@Entity('cards')
@Index('IDX_cards_column_position', ['column', 'position'])
@Index('IDX_cards_assignedTo_createdAt', ['assignedTo', 'createdAt'])
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'double precision', default: 0 })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BoardColumn, (col) => col.cards, { onDelete: 'CASCADE' })
  column: BoardColumn;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  assignedTo?: User | null;

  @ManyToMany(() => Tag, (tag) => tag.cards)
  @JoinTable({
    name: 'card_tags',
    joinColumn: { name: 'cardId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @OneToMany(() => CardHistory, (h) => h.card)
  history: CardHistory[];
}
