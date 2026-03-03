import { IsEnum } from 'class-validator';

import { BoardRole } from '../entity/board-members.entity';

export class UpdateMemberRoleDto {
  @IsEnum(BoardRole)
  role: BoardRole;
}
