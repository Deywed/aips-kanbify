import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { NotificationsGateway } from '../notifications.gateway';

import { EVENTS } from 'src/common/constants/events.constants';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

import { BoardMemberEvent } from 'src/board-members/events/board-member.event';

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

  private async handleBoardMemberEvent(
    event: BoardMemberEvent,
    type: NotificationType,
  ) {
    const { boardId, targetUserId, changedByUserId, role } = event;

    const notification = this.notificationRepo.create({
      user: { id: targetUserId },
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
        targetUserId,
        SOCKET_EVENTS.NOTIFICATIONS.NEW,
        plainToInstance(Notification, fullNotification),
      );
    } catch (error) {
      this.logger.error(
        `Failed to create notification for user ${targetUserId} about board ${boardId}: ${error.message}`,
      );
    }
  }
}
