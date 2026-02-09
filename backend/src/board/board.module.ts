import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardGateway } from './board.gateway';
import { BoardEventsListener } from './listeners/board-events.listener';

import { Board } from './entity/board.entity';
import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { BoardMembersModule } from 'src/board-members/board-members.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember]), BoardMembersModule],
  providers: [BoardService, BoardGateway, BoardEventsListener],
  controllers: [BoardController],
})
export class BoardModule {}
