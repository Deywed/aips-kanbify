import { SetMetadata } from '@nestjs/common';
import { BoardRole } from 'src/board-members/entity/board-members.entity';

export const BOARD_ROLES_KEY = 'board_roles';

export const BoardRoleDecorator = (...roles: BoardRole[]) =>
  SetMetadata(BOARD_ROLES_KEY, roles);
