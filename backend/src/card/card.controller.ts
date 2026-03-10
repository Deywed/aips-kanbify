import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { BoardRole } from 'src/board-members/entity/board-members.entity';
import { BoardRoleDecorator } from 'src/common/decorators/board-role.decorator';
import { BoardRoleGuard } from 'src/common/guards/board-role.guard';

import { CardService } from './card.service';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

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

  @Delete(':cardId')
  @BoardRoleDecorator(BoardRole.ADMIN)
  removeCard(
    @Req() req: Request,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Param('cardId', ParseUUIDPipe) cardId: string,
  ) {
    const user = req['user'] as JwtPayload;
    return this.cardService.removeCard(boardId, columnId, cardId, user.sub);
  }

  @Patch(':cardId')
  updateCard(
    @Req() req: Request,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: UpdateCardDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.cardService.updateCard(
      boardId,
      columnId,
      cardId,
      dto,
      user.sub,
    );
  }

  @Patch(':cardId/move')
  moveCard(
    @Req() req: Request,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Param('cardId', ParseUUIDPipe) cardId: string,
    @Body() dto: MoveCardDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.cardService.moveCard(boardId, columnId, cardId, dto, user.sub);
  }
}
