import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENTS } from 'src/common/constants/events.constants';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

import { BoardGateway } from '../board.gateway';

import { BoardTagAddedEvent } from 'src/tag/events/board-tag-added.event';
import { BoardTagRemovedEvent } from 'src/tag/events/board-tag-removed.event';
import { BoardTagUpdatedEvent } from 'src/tag/events/board-tag-updated.event';

@Injectable()
export class BoardTagListener {
  constructor(private boardGateway: BoardGateway) {}

  @OnEvent(EVENTS.BOARD_TAG_CREATED)
  handleBoardTagCreated(event: BoardTagAddedEvent) {
    this.boardGateway.emitToBoard(
      event.tag.board.id,
      SOCKET_EVENTS.BOARD.TAG_ADDED,
      event,
    );
  }

  @OnEvent(EVENTS.BOARD_TAG_DELETED)
  handleBoardTagDeleted(event: BoardTagRemovedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.TAG_REMOVED,
      event,
    );
  }

  @OnEvent(EVENTS.BOARD_TAG_UPDATED)
  handleBoardTagUpdated(event: BoardTagUpdatedEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.TAG_UPDATED,
      event,
    );
  }
}
