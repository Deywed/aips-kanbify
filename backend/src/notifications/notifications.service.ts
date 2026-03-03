import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entity/notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  getUnreadNotificationsCount(userId: string) {
    return this.notificationRepository.count({
      where: {
        user: { id: userId },
        isRead: false,
      },
    });
  }

  async markAllAsRead(userId: string) {
    try {
      const result = await this.notificationRepository.update(
        { user: { id: userId }, isRead: false },
        { isRead: true },
      );

      return { markedAsReadCount: result.affected || 0 };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw new InternalServerErrorException(
        'Failed to mark notifications as read',
      );
    }
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userId },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    try {
      const removedNotification =
        await this.notificationRepository.remove(notification);

      return removedNotification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }
}
