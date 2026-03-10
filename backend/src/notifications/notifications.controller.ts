import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { NotificationsService } from './notifications.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @Req() request: Request,
    @Query() query: PaginationQueryDto,
  ) {
    const user = request['user'] as JwtPayload;
    return this.notificationsService.getNotifications(user.sub, query);
  }

  @Get('/unread-count')
  getUnreadNotificationsCount(@Req() request: Request) {
    const user = request['user'] as JwtPayload;
    return this.notificationsService.getUnreadNotificationsCount(user.sub);
  }

  @Post('/mark-all-as-read')
  markAllAsRead(@Req() request: Request) {
    const user = request['user'] as JwtPayload;
    return this.notificationsService.markAllAsRead(user.sub);
  }

  @Delete(':id')
  deleteNotification(
    @Param('id', ParseUUIDPipe) notificationId: string,
    @Req() request: Request,
  ) {
    const user = request['user'] as JwtPayload;
    return this.notificationsService.deleteNotification(
      notificationId,
      user.sub,
    );
  }
}
