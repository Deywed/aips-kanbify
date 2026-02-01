import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BoardService } from './board.service';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { BoardRoleGuard } from 'src/common/guards/board-role.guard';
import { BoardRoleDecorator } from 'src/common/decorators/board-role.decorator';

import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRole } from 'src/board-members/entity/board-members.entity';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  createBoard(@Req() req: Request, @Body() dto: CreateBoardDto) {
    const user = req['user'] as JwtPayload;
    return this.boardService.createBoard(dto, user.sub);
  }

  @Delete(':id')
  @UseGuards(BoardRoleGuard)
  @BoardRoleDecorator(BoardRole.ADMIN)
  deleteBoard(@Param('id', ParseUUIDPipe) id: string) {
    return this.boardService.deleteBoard(id);
  }
}
