import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { BoardRoleGuard } from 'src/common/guards/board-role.guard';
import { BoardRole } from 'src/board-members/entity/board-members.entity';
import { BoardRoleDecorator } from 'src/common/decorators/board-role.decorator';

@Controller('board/:boardId/tags')
@UseGuards(BoardRoleGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAllTags(@Param('boardId', ParseUUIDPipe) boardId: string) {
    return this.tagService.getAllTags(boardId);
  }

  @Post()
  createTag(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateTagDto,
  ) {
    return this.tagService.createTag(boardId, dto);
  }

  @Delete(':id')
  @BoardRoleDecorator(BoardRole.ADMIN)
  deleteTag(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id') id: string,
  ) {
    return this.tagService.deleteTag(boardId, id);
  }

  @Patch(':id')
  @BoardRoleDecorator(BoardRole.ADMIN)
  updateTag(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return this.tagService.updateTag(boardId, id, dto);
  }
}
