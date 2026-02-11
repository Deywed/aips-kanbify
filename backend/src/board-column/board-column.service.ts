import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { POSITION_GAP } from 'src/common/constants/positions.constant';

import { BoardColumn } from './entity/board-column.entity';
import { Board } from 'src/board/entity/board.entity';
import { Card } from 'src/card/entity/card.entity';

import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ReorderColumnDto } from './dto/reorder-column.dto';
import { EVENTS } from 'src/common/constants/events.constants';
import { BoardColumnAddedEvent } from './events/board-column-added.event';
import { BoardColumnRemovedEvent } from './events/board-column-removed.event';
import { BoardColumnUpdatedEvent } from './events/board-column-updated.event';

@Injectable()
export class BoardColumnService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly columnRepo: Repository<BoardColumn>,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createColumn(
    boardId: string,
    dto: CreateColumnDto,
    currentUserId: string,
  ) {
    const board = await this.boardRepo.findOneBy({ id: boardId });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const lastColumn = await this.columnRepo.findOne({
      where: {
        board: { id: boardId },
      },
      order: {
        position: 'DESC',
      },
    });

    const position = lastColumn
      ? Number(lastColumn.position) + POSITION_GAP
      : POSITION_GAP;

    const column = this.columnRepo.create({
      title: dto.title,
      board,
      position,
    });

    try {
      const saved = await this.columnRepo.save(column);
      this.eventEmitter.emit(
        EVENTS.BOARD_COLUMN_ADDED,
        new BoardColumnAddedEvent(saved, currentUserId),
      );
      return saved;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create column');
    }
  }

  async removeColumn(boardId: string, columnId: string, currentUserId: string) {
    const column = await this.getColumnById(boardId, columnId);

    try {
      await this.columnRepo.remove(column);
      this.eventEmitter.emit(
        EVENTS.BOARD_COLUMN_REMOVED,
        new BoardColumnRemovedEvent(boardId, columnId, currentUserId),
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to remove column');
    }

    return { id: columnId };
  }

  async updateColumn(
    boardId: string,
    columnId: string,
    dto: UpdateColumnDto,
    currentUserId: string,
  ) {
    const column = await this.getColumnById(boardId, columnId);

    Object.assign(column, dto);

    try {
      const saved = await this.columnRepo.save(column);
      this.eventEmitter.emit(
        EVENTS.BOARD_COLUMN_UPDATED,
        new BoardColumnUpdatedEvent(
          boardId,
          columnId,
          saved.title,
          currentUserId,
        ),
      );
      return saved;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update column');
    }
  }

  async reorderColumnAfter(
    boardId: string,
    columnId: string,
    dto: ReorderColumnDto,
  ) {
    if (dto.afterId === columnId) {
      throw new BadRequestException('Invalid afterId');
    }

    const column = await this.getColumnById(boardId, columnId);

    let newPosition: number;

    // Move to start
    if (!dto.afterId) {
      const first = await this.columnRepo.findOne({
        where: { board: { id: boardId } },
        order: { position: 'ASC' },
      });

      if (!first) {
        newPosition = POSITION_GAP;
      } else {
        newPosition = Number(first.position) - POSITION_GAP;
      }
    }

    // Move after another column
    else {
      const after = await this.getColumnById(boardId, dto.afterId);

      // Find column after the "after" column
      const next = await this.columnRepo.findOne({
        where: {
          board: { id: boardId },
          position: MoreThan(after.position),
        },
        order: { position: 'ASC' },
      });

      if (!next) {
        newPosition = Number(after.position) + POSITION_GAP;
      } else {
        newPosition = (Number(after.position) + Number(next.position)) / 2;
      }
    }

    column.position = newPosition;

    try {
      await this.columnRepo.save(column);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to reorder column');
    }

    return column;
  }

  async getColumns(boardId: string) {
    const columns = await this.columnRepo.find({
      where: { board: { id: boardId } },
      order: { position: 'ASC' },
      relations: ['cards', 'cards.assignedTo', 'cards.tags'],
    });

    return columns;
  }

  async getColumnById(boardId: string, columnId: string) {
    const column = await this.columnRepo.findOne({
      where: {
        id: columnId,
        board: { id: boardId },
      },
    });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    return column;
  }

  async getNextTopPosition(columnId: string) {
    const firstCard = await this.cardRepo.findOne({
      where: { column: { id: columnId } },
      order: { position: 'ASC' },
    });

    if (!firstCard) {
      return POSITION_GAP;
    }

    return Number(firstCard.position) - POSITION_GAP;
  }
}
