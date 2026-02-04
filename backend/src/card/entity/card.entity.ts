import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BoardColumn } from 'src/board-column/entity/board-column.entity';
import { User } from 'src/users/entity/user.entity';
import { CardTag } from 'src/tag/entity/card-tag.entity';
import { CardHistory } from 'src/card-history/entity/card-history.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column('numeric', { precision: 10, scale: 5 })
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
  assignedTo?: User;

  @OneToMany(() => CardTag, (ct) => ct.card, { cascade: ['insert'] })
  tags: CardTag[];

  @OneToMany(() => CardHistory, (h) => h.card)
  history: CardHistory[];
}
