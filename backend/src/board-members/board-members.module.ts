import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardMember } from './entity/board-members.entity';
import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/users/entity/user.entity';

import { BoardRoleGuard } from '../common/guards/board-role.guard';

import { BoardMembersService } from './board-members.service';
import { BoardMembersController } from './board-members.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember, Board, User])],
  providers: [BoardMembersService, BoardRoleGuard],
  controllers: [BoardMembersController],
  exports: [BoardMembersService, BoardRoleGuard],
})
export class BoardMembersModule {}
