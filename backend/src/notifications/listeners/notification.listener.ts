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

import {
  Notification,
  NotificationType,
} from 'src/notifications/entity/notifications.entity';

@Injectable()
export class NotificationListener {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  private readonly logger = new Logger(NotificationListener.name);

  // Board members events
  @OnEvent(EVENTS.BOARD_MEMBER_ADDED)
  async handleBoardMemberAddedEvent(event: BoardMemberEvent) {
    await this.handleBoardMemberEvent(
      event,
      NotificationType.BOARD_MEMBER_ADDED,
    );
  }

  @OnEvent(EVENTS.BOARD_MEMBER_REMOVED)
  async handleBoardMemberRemovedEvent(event: BoardMemberEvent) {
    await this.handleBoardMemberEvent(
      event,
      NotificationType.BOARD_MEMBER_REMOVED,
    );
  }

  @OnEvent(EVENTS.BOARD_MEMBER_ROLE_UPDATED)
  async handleBoardMemberRoleUpdatedEvent(event: BoardMemberEvent) {
    await this.handleBoardMemberEvent(
      event,
      NotificationType.BOARD_MEMBER_ROLE_UPDATED,
    );
  }

  // Card events
  @OnEvent(EVENTS.BOARD_COLUMN_CARD_CREATED)
  async handleCardCreatedEvent(event: CardCreatedEvent) {
    const { boardId, card, actorId } = event;

    if (!card.assignedTo) {
      return;
    }

    const notification = this.notificationRepo.create({
      user: { id: card.assignedTo.id },
      triggeredBy: { id: actorId },
      board: { id: boardId },
      card: { id: card.id },
      type: NotificationType.CARD_ASSIGNED,
    });

    try {
      await this.notificationRepo.save(notification);

      const fullNotification = await this.notificationRepo.findOne({
        where: { id: notification.id },
        relations: ['triggeredBy', 'board', 'card'],
      });

      this.notificationsGateway.sendToUser(
        card.assignedTo.id,
        SOCKET_EVENTS.NOTIFICATIONS.NEW,
        plainToInstance(Notification, fullNotification),
      );
    } catch (error) {
      this.logger.error(
        `Failed to create notification for user ${card.assignedTo.id} about card assignment on board ${boardId}: ${error.message}`,
      );
    }
  }

  private async handleBoardMemberEvent(
    event: BoardMemberEvent,
    type: NotificationType,
  ) {
    const { boardId, targetMember, changedByUserId, role } = event;

    const notification = this.notificationRepo.create({
      user: { id: targetMember.user.id },
      triggeredBy: { id: changedByUserId },
      board: { id: boardId },
      payload: role ? { role } : null,
      type,
    });

    try {
      await this.notificationRepo.save(notification);

      const fullNotification = await this.notificationRepo.findOne({
        where: { id: notification.id },
        relations: ['triggeredBy', 'board'],
      });

      this.notificationsGateway.sendToUser(
        targetMember.user.id,
        SOCKET_EVENTS.NOTIFICATIONS.NEW,
        plainToInstance(Notification, fullNotification),
      );
    } catch (error) {
      this.logger.error(
        `Failed to create notification for user ${targetMember.user.id} about board ${boardId}: ${error.message}`,
      );
    }
  }
}
