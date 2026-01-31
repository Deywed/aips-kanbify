import { Module } from '@nestjs/common';
import { BoardMembersService } from './board-members.service';

@Module({
  providers: [BoardMembersService]
})
export class BoardMembersModule {}
