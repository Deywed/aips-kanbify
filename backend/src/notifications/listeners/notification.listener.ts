import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { NotificationsGateway } from '../notifications.gateway';

import { EVENTS } from 'src/common/constants/events.constants';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

import { BoardMemberEvent } from 'src/board-members/events/board-member.event';
import { CardCreatedEvent } from 'src/card/events/card-created.event';
import { CardUpdatedEvent } from 'src/card/events/card-updated.event';

import {
  Notification,
  NotificationType,
} from 'src/notifications/entity/notifications.entity';

type CreateNotificationPayload = Parameters<
  Repository<Notification>['create']
>[0];

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // ─── Board Member Events ────────────────────────────────────────────────────

  @OnEvent(EVENTS.BOARD_MEMBER_ADDED)
  handleBoardMemberAddedEvent(event: BoardMemberEvent) {
    return this.handleBoardMemberEvent(
      event,
      NotificationType.BOARD_MEMBER_ADDED,
    );
  }

  @OnEvent(EVENTS.BOARD_MEMBER_REMOVED)
  handleBoardMemberRemovedEvent(event: BoardMemberEvent) {
    return this.handleBoardMemberEvent(
      event,
      NotificationType.BOARD_MEMBER_REMOVED,
    );
  }

  @OnEvent(EVENTS.BOARD_MEMBER_ROLE_UPDATED)
  handleBoardMemberRoleUpdatedEvent(event: BoardMemberEvent) {
    return this.handleBoardMemberEvent(
      event,
      NotificationType.BOARD_MEMBER_ROLE_UPDATED,
    );
  }

  private async handleBoardMemberEvent(
    event: BoardMemberEvent,
    type: NotificationType,
  ) {
    const { boardId, targetMember, changedByUserId, role } = event;

    await this.createAndSendNotification(
      targetMember.user.id,
      {
        user: { id: targetMember.user.id },
        triggeredBy: { id: changedByUserId },
        board: { id: boardId },
        payload: role ? { role } : null,
        type,
      },
      ['triggeredBy', 'board'],
    );
  }

  // ─── Card Events ────────────────────────────────────────────────────────────

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_CREATED)
  async handleCardCreatedEvent({ boardId, card, actorId }: CardCreatedEvent) {
    if (!card.assignedTo) return;

    await this.createAndSendNotification(
      card.assignedTo.id,
      {
        user: { id: card.assignedTo.id },
        triggeredBy: { id: actorId },
        board: { id: boardId },
        card: { id: card.id },
        type: NotificationType.CARD_ASSIGNED,
      },
      ['triggeredBy', 'board', 'card'],
    );
  }

  @OnEvent(EVENTS.BOARD_COLUMN_CARD_UPDATED)
  async handleCardUpdatedEvent({
    boardId,
    card,
    actorId,
    oldCard,
  }: CardUpdatedEvent) {
    const oldAssignedToId = oldCard?.assignedTo?.id ?? null;
    const newAssignedToId = card.assignedTo?.id ?? null;

    if (!newAssignedToId || oldAssignedToId === newAssignedToId) return;

    await this.createAndSendNotification(
      newAssignedToId,
      {
        user: { id: newAssignedToId },
        triggeredBy: { id: actorId },
        board: { id: boardId },
        card: { id: card.id },
        type: NotificationType.CARD_ASSIGNED,
      },
      ['triggeredBy', 'board', 'card'],
    );
  }

  // ─── Shared Helper ──────────────────────────────────────────────────────────

  private async createAndSendNotification(
    recipientId: string,
    payload: CreateNotificationPayload,
    relations: string[],
  ) {
    const notification = this.notificationRepo.create(payload);

    try {
      await this.notificationRepo.save(notification);

      const fullNotification = await this.notificationRepo.findOne({
        where: { id: notification.id },
        relations,
      });

      this.notificationsGateway.sendToUser(
        recipientId,
        SOCKET_EVENTS.NOTIFICATIONS.NEW,
        plainToInstance(Notification, fullNotification),
      );
    } catch (error) {
      this.logger.error(
        `Failed to create notification for user ${recipientId}: ${error.message}`,
      );
    }
  }
}
