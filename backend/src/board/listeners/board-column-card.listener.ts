import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENTS } from 'src/common/constants/events.constants';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

import { BoardGateway } from '../board.gateway';

import { CardCreatedEvent } from 'src/card/events/card-created.event';
import { CardDeletedEvent } from 'src/card/events/card-deleted.event';
import { CardUpdatedEvent } from 'src/card/events/card-updated.event';
import { CardMovedEvent } from 'src/card/events/card-moved.event';

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

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_UPDATED)
  handleBoardColumnCardUpdated(event: CardUpdatedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.COLUMN_CARD_UPDATED,
      event,
    );
  }

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_MOVED)
  handleBoardColumnCardMoved(event: CardMovedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.COLUMN_CARD_MOVED,
      event,
    );
  }
}
