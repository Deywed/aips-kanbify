import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Board } from './entity/board.entity';
import {
  BoardMember,
  BoardRole,
} from 'src/board-members/entity/board-members.entity';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

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
        description: dto.description,
      });

      await queryRunner.manager.save(board);

      // Add creator as admin member
      const member = queryRunner.manager.create(BoardMember, {
        board: { id: board.id },
        user: { id: currentUserId },
        role: BoardRole.ADMIN,
      });

      const savedMember = await queryRunner.manager.save(member);

      const memberWithUser = await queryRunner.manager.findOne(BoardMember, {
        where: { id: savedMember.id },
        relations: ['user'],
      });

      await queryRunner.commitTransaction();

      return {
        ...board,
        members: [memberWithUser?.user],
        role: member.role,
      };
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException('Failed to create board');
    } finally {
      await queryRunner.release();
    }
  }

  async updateBoard(id: string, dto: UpdateBoardDto) {
    const board = await this.boardRepo.findOneBy({ id });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    Object.assign(board, dto); // Update board properties with dto

    try {
      return await this.boardRepo.save(board);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update board');
    }
  }

  async deleteBoard(boardId: string) {
    const board = await this.boardRepo.findOneBy({ id: boardId });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    try {
      await this.boardRepo.remove(board);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete board');
    }

    return {
      id: boardId,
    };
  }

  async getBoardsForUser(userId: string) {
    const memberships = await this.memberRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ['board', 'board.members.user'],
      order: {
        board: {
          updatedAt: 'DESC',
        },
      },
    });

    return memberships.map((membership) => ({
      ...membership.board,
      members: membership.board.members.map((m) => ({
        ...m.user,
        role: m.role,
      })),
      role: membership.role,
    }));
  }

  async getBoardById(boardId: string, currentUserId: string) {
    const membership = await this.memberRepo.findOne({
      where: {
        board: { id: boardId },
        user: { id: currentUserId },
      },
    });

    if (!membership) {
      throw new NotFoundException('You are not a member of this board');
    }

    const board = await this.boardRepo.findOne({
      where: { id: boardId },
      relations: [
        'columns',
        'columns.cards',
        'columns.cards.tags',
        'columns.cards.assignedTo',
        'columns.cards.createdBy',
        'members.user',
      ],
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return {
      ...board,
      members: board.members.map((m) => ({
        ...m.user,
        role: m.role,
      })),
      role: membership.role,
    };
  }
}
