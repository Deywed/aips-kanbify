import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardGateway } from './board.gateway';

import { Board } from './entity/board.entity';
import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { BoardMembersModule } from 'src/board-members/board-members.module';

import { BoardColumnListener } from './listeners/board-column.listener';
import { BoardTagListener } from './listeners/board-tag.listener';
import { BoardMemberListener } from './listeners/board-member.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember]), BoardMembersModule],
  providers: [
    BoardService,
    BoardGateway,
    BoardColumnListener,
    BoardTagListener,
    BoardMemberListener,
  ],
  controllers: [BoardController],
})
export class BoardModule {}
