import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { BoardRoleGuard } from 'src/common/guards/board-role.guard';
import { BoardRole } from 'src/board-members/entity/board-members.entity';
import { BoardRoleDecorator } from 'src/common/decorators/board-role.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

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
    @Req() req,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateTagDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tagService.createTag(boardId, dto, user.sub);
  }

  @Delete(':id')
  @BoardRoleDecorator(BoardRole.ADMIN)
  deleteTag(
    @Req() req,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id') id: string,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tagService.deleteTag(boardId, id, user.sub);
  }

  @Patch(':id')
  @BoardRoleDecorator(BoardRole.ADMIN)
  updateTag(
    @Req() req,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTagDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.tagService.updateTag(boardId, id, dto, user.sub);
  }
}
