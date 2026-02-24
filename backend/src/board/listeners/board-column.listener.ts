import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENTS } from 'src/common/constants/events.constants';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

import { BoardGateway } from '../board.gateway';

import { BoardColumnAddedEvent } from 'src/board-column/events/board-column-added.event';
import { BoardColumnRemovedEvent } from 'src/board-column/events/board-column-removed.event';
import { BoardColumnUpdatedEvent } from 'src/board-column/events/board-column-updated.event';
import { BoardColumnReorderedEvent } from 'src/board-column/events/board-column-reordered.event';

@Injectable()
export class BoardColumnListener {
  constructor(private boardGateway: BoardGateway) {}

  @OnEvent(EVENTS.BOARD_COLUMN_ADDED)
  handleBoardColumnAdded(event: BoardColumnAddedEvent) {
    this.boardGateway.emitToBoard(
      event.column.board.id,
      SOCKET_EVENTS.BOARD.COLUMN_ADDED,
      event,
    );
  }

  @OnEvent(EVENTS.BOARD_COLUMN_REMOVED)
  handleBoardColumnRemoved(event: BoardColumnRemovedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.COLUMN_REMOVED,
      event,
    );
  }

  @OnEvent(EVENTS.BOARD_COLUMN_UPDATED)
  handleBoardColumnUpdated(event: BoardColumnUpdatedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.COLUMN_UPDATED,
      event,
    );
  }

  @OnEvent(EVENTS.BOARD_COLUMN_REORDERED)
  handleBoardColumnReordered(event: BoardColumnReorderedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.COLUMN_REORDERED,
      event,
    );
  }
}
