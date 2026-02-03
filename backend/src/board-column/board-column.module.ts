import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardColumnService } from './board-column.service';
import { BoardColumnController } from './board-column.controller';

import { BoardRoleGuard } from 'src/common/guards/board-role.guard';

import { BoardColumn } from './entity/board-column.entity';
import { Board } from 'src/board/entity/board.entity';
import { BoardMember } from 'src/board-members/entity/board-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardColumn, Board, BoardMember])],
  providers: [BoardColumnService, BoardRoleGuard],
  controllers: [BoardColumnController],
  exports: [BoardColumnService],
})
export class BoardColumnModule {}
