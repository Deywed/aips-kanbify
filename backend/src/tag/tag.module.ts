import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { TagController } from './tag.controller';
import { BoardMember } from 'src/board-members/entity/board-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardMember, Tag])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
