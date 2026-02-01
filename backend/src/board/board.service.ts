import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Board } from './entity/board.entity';
import {
  BoardMember,
  BoardRole,
} from 'src/board-members/entity/board-members.entity';

import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,

    @InjectRepository(BoardMember)
    private readonly memberRepo: Repository<BoardMember>,
  ) {}

  async createBoard(dto: CreateBoardDto, currentUserId: string) {
    const queryRunner = this.boardRepo.manager.connection.createQueryRunner();

    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create board
      const board = queryRunner.manager.create(Board, {
        title: dto.title,
      });

      await queryRunner.manager.save(board);

      // Add creator as admin member
      const member = queryRunner.manager.create(BoardMember, {
        board: { id: board.id },
        user: { id: currentUserId },
        role: BoardRole.ADMIN,
      });

      await queryRunner.manager.save(member);

      await queryRunner.commitTransaction();

      return board;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException('Failed to create board');
    } finally {
      await queryRunner.release();
    }
  }
}
