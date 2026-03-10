import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EVENTS } from 'src/common/constants/events.constants';
import { CardHistoryService } from '../card-history.service';
import {
  CardActionType,
  AssignedPayload,
  MovedPayload,
  UpdatedPayload,
} from '../entity/card-history.entity';

import { CardCreatedEvent } from 'src/card/events/card-created.event';
import { CardUpdatedEvent } from 'src/card/events/card-updated.event';
import { CardMovedEvent } from 'src/card/events/card-moved.event';

@Injectable()
export class CardHistoryListener {
  constructor(private readonly cardHistoryService: CardHistoryService) {}

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_CREATED)
  async handleCardCreated(event: CardCreatedEvent) {
    await this.cardHistoryService.record(
      event.card.id,
      event.actorId,
      CardActionType.CREATED,
    );
  }

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_UPDATED)
  async handleCardUpdated(event: CardUpdatedEvent) {
    const { card, oldCard, actorId } = event;
    if (!oldCard) return;

    const fields: Array<'title' | 'description' | 'dueDate'> = [
      'title',
      'description',
      'dueDate',
    ];

    for (const field of fields) {
      const oldVal = oldCard[field] ?? null;
      const newVal = card[field] ?? null;
      const oldStr =
        oldVal instanceof Date
          ? oldVal.toISOString()
          : (oldVal as string | null);
      const newStr =
        newVal instanceof Date
          ? newVal.toISOString()
          : (newVal as string | null);

      if (oldStr !== newStr) {
        const payload: UpdatedPayload = {
          field,
          oldValue: oldStr,
          newValue: newStr,
        };
        await this.cardHistoryService.record(
          card.id,
          actorId,
          CardActionType.UPDATED,
          payload,
        );
      }
    }

    const oldAssigneeId = oldCard.assignedTo?.id ?? null;
    const newAssigneeId = card.assignedTo?.id ?? null;

    if (oldAssigneeId !== newAssigneeId) {
      const oldName = oldCard.assignedTo
        ? `${oldCard.assignedTo.firstName} ${oldCard.assignedTo.lastName}`
        : null;
      const newName = card.assignedTo
        ? `${card.assignedTo.firstName} ${card.assignedTo.lastName}`
        : null;

      const payload: AssignedPayload = {
        oldAssigneeId,
        oldAssigneeName: oldName,
        newAssigneeId,
        newAssigneeName: newName,
      };
      await this.cardHistoryService.record(
        card.id,
        actorId,
        CardActionType.ASSIGNED,
        payload,
      );
    }
  }

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_MOVED)
  async handleCardMoved(event: CardMovedEvent) {
    if (event.oldColumnId === event.newColumnId) return;

    const payload: MovedPayload = {
      fromColumnId: event.oldColumnId,
      fromColumnName: event.oldColumnName,
      toColumnId: event.newColumnId,
      toColumnName: event.newColumnName,
    };

    await this.cardHistoryService.record(
      event.cardId,
      event.actorId,
      CardActionType.MOVED,
      payload,
    );
  }
}
