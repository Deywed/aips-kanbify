import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BoardRoleGuard } from 'src/common/guards/board-role.guard';
import { BoardRoleDecorator } from 'src/common/decorators/board-role.decorator';

import { BoardMembersService } from './board-members.service';
import { BoardRole } from './entity/board-members.entity';

import { AddMemberDto } from './dto/add-member.dto';

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
}
