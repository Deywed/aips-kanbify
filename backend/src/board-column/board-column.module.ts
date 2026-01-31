import { Module } from '@nestjs/common';
import { BoardColumnService } from './board-column.service';

@Module({
  providers: [BoardColumnService],
})
export class BoardColumnModule {}
