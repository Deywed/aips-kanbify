import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENTS } from 'src/common/constants/events.constants';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

import { BoardGateway } from '../board.gateway';

import { CardCreatedEvent } from 'src/card/events/card-created.event';
import { CardDeletedEvent } from 'src/card/events/card-deleted.event';

@Injectable()
export class BoardColumnCardListener {
  constructor(private boardGateway: BoardGateway) {}

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_CREATED)
  handleBoardColumnCardCreated(event: CardCreatedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.COLUMN_CARD_CREATED,
      event,
    );
  }

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_DELETED)
  handleBoardColumnCardDeleted(event: CardDeletedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.COLUMN_CARD_DELETED,
      event,
    );
  }
}
