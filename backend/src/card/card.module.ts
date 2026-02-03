import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { CardController } from './card.controller';
import { BoardColumn } from 'src/board-column/entity/board-column.entity';
import { Board } from 'src/board/entity/board.entity';
import { BoardColumnModule } from 'src/board-column/board-column.module';
import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { BoardMembersModule } from 'src/board-members/board-members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, Board, BoardColumn, BoardMember]),
    BoardColumnModule,
    BoardMembersModule,
  ],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
