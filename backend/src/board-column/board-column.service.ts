import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MoreThan, Repository } from 'typeorm';

import { BoardColumn } from './entity/board-column.entity';
import { Board } from 'src/board/entity/board.entity';

import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ReorderColumnDto } from './dto/reorder-column.dto';

@Injectable()
export class BoardColumnService {
  constructor(
    @InjectRepository(BoardColumn)
    private readonly columnRepo: Repository<BoardColumn>,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async createColumn(boardId: string, dto: CreateColumnDto) {
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

    const position = lastColumn ? Number(lastColumn.position) + 1 : 1;

    const column = this.columnRepo.create({
      title: dto.title,
      board,
      position,
    });

    try {
      await this.columnRepo.save(column);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create column');
    }

    return column;
  }

  async removeColumn(boardId: string, columnId: string) {
    const column = await this.getColumnById(boardId, columnId);

    try {
      await this.columnRepo.remove(column);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to remove column');
    }

    return { id: columnId };
  }

  async updateColumn(boardId: string, columnId: string, dto: UpdateColumnDto) {
    const column = await this.getColumnById(boardId, columnId);

    Object.assign(column, dto);

    try {
      await this.columnRepo.save(column);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update column');
    }

    return column;
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
        newPosition = 1;
      } else {
        newPosition = Number(first.position) - 1;
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
        newPosition = Number(after.position) + 1;
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

  public async getColumnById(boardId: string, columnId: string) {
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
}
