import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationsGateway } from '../notifications.gateway';

import { EVENTS } from 'src/common/constants/events.constants';

import {
  Notification,
  NotificationType,
} from 'src/notifications/entity/notifications.entity';

import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';
import { BoardMemberAddedEvent } from 'src/board-members/events/board-member-added.event';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NotificationListener {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,

    private notificationsGateway: NotificationsGateway,
  ) {}

  private readonly logger = new Logger(NotificationListener.name);

  @OnEvent(EVENTS.BOARD_MEMBER_ADDED)
  async handleBoardMemberAddedEvent(event: BoardMemberAddedEvent) {
    const { boardId, targetUserId, addedByUserId, role } = event;

    const notification = this.notificationRepo.create({
      user: { id: targetUserId },
      triggeredBy: { id: addedByUserId },
      board: { id: boardId },
      payload: { role },
      type: NotificationType.BOARD_MEMBER_ADDED,
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
        `Failed to create notification for user ${targetUserId} about board ${boardId} addition: ${error.message}`,
      );
    }
  }
}
