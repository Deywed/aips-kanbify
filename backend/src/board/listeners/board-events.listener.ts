import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENTS } from 'src/common/constants/events.constants';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

import { BoardMemberResponseDto } from 'src/board-members/dto/board-member-response.dto';

import { BoardMemberEvent } from 'src/board-members/events/board-member.event';
import { BoardGateway } from '../board.gateway';

@Injectable()
export class BoardEventsListener {
  constructor(private boardGateway: BoardGateway) {}

  @OnEvent(EVENTS.BOARD_MEMBER_ADDED)
  handleBoardMemberAdded(event: BoardMemberEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.MEMBER_ADDED,
      {
        member: BoardMemberResponseDto.fromEntity(event.targetMember), // Send the full member info
      },
    );
  }

  @OnEvent(EVENTS.BOARD_MEMBER_REMOVED)
  handleBoardMemberRemoved(event: BoardMemberEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.MEMBER_REMOVED,
      {
        userId: event.targetMember.user.id, // Removed user id
      },
    );
  }

  @OnEvent(EVENTS.BOARD_MEMBER_ROLE_UPDATED)
  handleBoardMemberRoleUpdated(event: BoardMemberEvent) {
    this.boardGateway.emitToBoard(
      event.boardId,
      SOCKET_EVENTS.BOARD.MEMBER_ROLE_UPDATED,
      {
        userId: event.targetMember.user.id,
        newRole: event.role, // The new role of the user
      },
    );
  }
}
