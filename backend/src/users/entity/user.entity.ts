import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BoardMember } from 'src/board-members/entity/board-members.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'text', nullable: true })
  avatarPublicId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BoardMember, (bm) => bm.user)
  memberships: BoardMember[];
}
