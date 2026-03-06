import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { CardHistoryService } from './card-history.service';

@Controller('cards/:cardId/history')
export class CardHistoryController {
  constructor(private readonly cardHistoryService: CardHistoryService) {}

  @Get()
  getCardHistory(@Param('cardId', ParseUUIDPipe) cardId: string) {
    return this.cardHistoryService.getHistory(cardId);
  }
}
