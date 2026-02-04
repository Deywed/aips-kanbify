import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { BoardRoleGuard } from 'src/common/guards/board-role.guard';

import { CardService } from './card.service';

import { CreateCardDto } from './dto/create-card.dto';

@Controller('/board/:boardId/columns/:columnId/cards')
@UseGuards(BoardRoleGuard)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  createCard(
    @Req() req: Request,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() dto: CreateCardDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.cardService.createCard(boardId, columnId, user.sub, dto);
  }
}
