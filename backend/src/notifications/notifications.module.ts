import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from './entity/notifications.entity';

import { NotificationsService } from './notifications.service';
import { NotificationListener } from './listeners/notification.listener';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsService, NotificationListener, NotificationsGateway],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
