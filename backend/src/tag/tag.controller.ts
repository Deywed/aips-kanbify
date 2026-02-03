import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAllTags() {
    return this.tagService.getAllTags();
  }
  @Get(':id')
  getTagById(@Param('id') id: string) {
    return this.tagService.getById(id);
  }

  @Post()
  createTag(@Body() dto: CreateTagDto) {
    return this.tagService.createTag(dto);
  }

  @Patch(':id')
  updateTag(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagService.updateTag(id, dto);
  }

  @Delete(':id')
  deleteTag(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }
}
