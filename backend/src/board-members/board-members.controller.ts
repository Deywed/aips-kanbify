import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { BoardRoleGuard } from 'src/common/guards/board-role.guard';
import { BoardRoleDecorator } from 'src/common/decorators/board-role.decorator';

import { BoardMembersService } from './board-members.service';
import { BoardRole } from './entity/board-members.entity';

import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Controller('board/:boardId/members')
@UseGuards(BoardRoleGuard)
export class BoardMembersController {
  constructor(private readonly boardMembersService: BoardMembersService) {}

  @Post()
  @BoardRoleDecorator(BoardRole.ADMIN)
  addMember(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.boardMembersService.addMember(boardId, dto);
  }

  @Patch('/:userId/role')
  @BoardRoleDecorator(BoardRole.ADMIN)
  updateMemberRole(
    @Req() req,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    const user = req.user as JwtPayload;
    return this.boardMembersService.updateMemberRole(
      boardId,
      user.sub, // requester
      userId, // target
      dto.role,
    );
  }
}
