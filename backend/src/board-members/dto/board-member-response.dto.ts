import { plainToInstance } from 'class-transformer';

import { User } from 'src/users/entity/user.entity';
import { BoardMember } from '../entity/board-members.entity';

export class BoardMemberResponseDto {
  static fromEntity(boardMember: BoardMember) {
    const userInstance = plainToInstance(User, boardMember.user);

    return {
      ...userInstance,
      role: boardMember.role,
    };
  }

  static fromEntities(boardMembers: BoardMember[]) {
    return boardMembers.map((bm) => this.fromEntity(bm));
  }
}
