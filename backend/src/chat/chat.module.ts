import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

import { ChatMessage } from './entity/chat-message.entity';
import { BoardMember } from 'src/board-members/entity/board-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage, BoardMember])],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
