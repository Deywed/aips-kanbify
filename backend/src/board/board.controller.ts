import { Body, Controller, Post, Req } from '@nestjs/common';

import { BoardService } from './board.service';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { CreateBoardDto } from './dto/create-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  createBoard(@Req() req: Request, @Body() dto: CreateBoardDto) {
    const user = req['user'] as JwtPayload;
    return this.boardService.createBoard(dto, user.sub);
  }
}
