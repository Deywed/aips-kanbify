import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagService } from './tag.service';
import { TagController } from './tag.controller';

import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { Tag } from './entity/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember, Tag])],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
