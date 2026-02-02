import { IsDefined, IsEnum, IsUUID } from 'class-validator';

import { BoardRole } from '../entity/board-members.entity';

export class AddMemberDto {
  @IsUUID()
  @IsDefined()
  userId: string;

  @IsEnum(BoardRole)
  @IsDefined()
  role: BoardRole;
}
