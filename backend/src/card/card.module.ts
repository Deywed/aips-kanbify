import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardController } from './card.controller';
import { CardService } from './card.service';

import { BoardColumnModule } from 'src/board-column/board-column.module';
import { BoardMembersModule } from 'src/board-members/board-members.module';

import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { BoardColumn } from 'src/board-column/entity/board-column.entity';
import { Card } from './entity/card.entity';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, BoardColumn, BoardMember]),
    BoardColumnModule,
    BoardMembersModule,
    TagModule,
  ],
  providers: [CardService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
