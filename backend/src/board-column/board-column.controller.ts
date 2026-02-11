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
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

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
    @Req() req,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Body() dto: CreateColumnDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.columnService.createColumn(boardId, dto, user.sub);
  }

  @Delete(':columnId')
  @BoardRoleDecorator(BoardRole.ADMIN)
  removeColumn(
    @Req() req,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
  ) {
    const user = req['user'] as JwtPayload;
    return this.columnService.removeColumn(boardId, columnId, user.sub);
  }

  @Patch(':columnId')
  updateColumn(
    @Req() req,
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('columnId', ParseUUIDPipe) columnId: string,
    @Body() dto: UpdateColumnDto,
  ) {
    const user = req['user'] as JwtPayload;
    return this.columnService.updateColumn(boardId, columnId, dto, user.sub);
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
