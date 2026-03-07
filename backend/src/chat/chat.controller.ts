import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { BoardRoleGuard } from 'src/common/guards/board-role.guard';

import { ChatService } from './chat.service';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';
import { UnreadCountQueryDto } from './dto/unread-count-query.dto';

@Controller('/board/:boardId/chat')
@UseGuards(BoardRoleGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  getMessages(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Query() query: GetMessagesQueryDto,
  ) {
    return this.chatService.getMessages(
      boardId,
      query.limit ?? 10,
      query.before,
    );
  }

  @Get('unread-count')
  async getUnreadCount(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Query() query: UnreadCountQueryDto,
  ) {
    const count = await this.chatService.getUnreadCount(
      boardId,
      query.lastSeenAt,
    );
    return { unreadCount: count };
  }
}
