import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardService } from './board.service';
import { BoardController } from './board.controller';

import { Board } from './entity/board.entity';
import { BoardMember } from 'src/board-members/entity/board-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardMember])],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
