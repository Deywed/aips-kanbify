import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  searchUsers(query: string, excludeBoardId?: string, currentUserId?: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('(user.email ILIKE :query OR user.username ILIKE :query)', {
        query: `%${query}%`,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('bm.userId')
          .from(BoardMember, 'bm')
          .where('bm.boardId = :excludeBoardId')
          .andWhere('bm.userId != :currentUserId')
          .getQuery();
        return 'user.id NOT IN ' + subQuery;
      })
      .setParameter('excludeBoardId', excludeBoardId)
      .setParameter('currentUserId', currentUserId)
      .limit(10)
      .getMany();
  }
}
