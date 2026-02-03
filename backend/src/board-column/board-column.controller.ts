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

import { BoardRoleGuard } from 'src/common/guards/board-role.guard';
import { BoardRoleDecorator } from 'src/common/decorators/board-role.decorator';
import { BoardRole } from 'src/board-members/entity/board-members.entity';

import { BoardColumnService } from './board-column.service';

import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ReorderColumnDto } from './dto/reorder-column.dto';

@Controller('board/:boardId/columns')
@UseGuards(BoardRoleGuard)
export class BoardColumnController {
  constructor(private readonly columnService: BoardColumnService) {}

  @Post()
  createColumn(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateColumnDto,
  ) {
    return this.columnService.createColumn(boardId, dto);
  }

  @Delete(':columnId')
  @BoardRoleDecorator(BoardRole.ADMIN)
  removeColumn(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
  ) {
    return this.columnService.removeColumn(boardId, columnId);
  }

  @Patch(':columnId')
  updateColumn(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnService.updateColumn(boardId, columnId, dto);
  }

  @Patch(':columnId/reorder')
  reorderColumn(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() dto: ReorderColumnDto,
  ) {
    return this.columnService.reorderColumnAfter(boardId, columnId, dto);
  }

  @Get()
  getColumns(@Param('boardId', ParseUUIDPipe) boardId: string) {
    return this.columnService.getColumns(boardId);
  }
}
