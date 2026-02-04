import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoardMember, BoardRole } from './entity/board-members.entity';
import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/users/entity/user.entity';

import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class BoardMembersService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly memberRepo: Repository<BoardMember>,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getMembers(boardId: string) {
    const members = await this.memberRepo.find({
      where: { board: { id: boardId } },
      relations: ['user'],
    });

    return members.map((m) => ({
      user: m.user,
      role: m.role,
    }));
  }

  async addMember(boardId: string, dto: AddMemberDto) {
    const board = await this.boardRepo.findOneBy({ id: boardId });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const user = await this.userRepo.findOneBy({ id: dto.userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const exists = await this.memberRepo.exists({
      where: {
        board: { id: boardId },
        user: { id: dto.userId },
      },
    });

    if (exists) {
      throw new BadRequestException('User is already a member of the board');
    }

    const member = this.memberRepo.create({
      board,
      user,
      role: dto.role,
    });

    try {
      await this.memberRepo.save(member);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to add member to the board',
      );
    }

    return member;
  }

  async updateMemberRole(
    boardId: string,
    requesterUserId: string,
    targetUserId: string,
    newRole: BoardRole,
  ) {
    if (requesterUserId === targetUserId) {
      throw new BadRequestException('You cannot change your own role');
    }

    const members = await this.memberRepo.find({
      where: {
        board: { id: boardId },
      },
      relations: ['user'],
    });

    if (members.length === 0) {
      throw new NotFoundException('No members found for the board');
    }

    const targetMember = members.find((m) => m.user.id === targetUserId);
    const requesterMember = members.find((m) => m.user.id === requesterUserId);

    if (!targetMember) {
      throw new NotFoundException('Target member is not a member of the board');
    }

    if (!requesterMember) {
      throw new NotFoundException('Requester is not a member of the board');
    }

    targetMember.role = newRole;

    const saved = await this.memberRepo.save(targetMember);

    return saved;
  }

  // TODO: Think about what happens with the cards assigned to the removed member
  async removeMember(boardId: string, userId: string, currentUserId: string) {
    if (userId === currentUserId) {
      throw new BadRequestException(
        'You cannot remove yourself from the board',
      );
    }

    const member = await this.memberRepo.findOne({
      where: {
        board: { id: boardId },
        user: { id: userId },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found in the board');
    }

    try {
      await this.memberRepo.remove(member);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to remove member from the board',
      );
    }

    return { id: userId };
  }

  async isUserMemberOfBoard(boardId: string, userId: string) {
    return await this.memberRepo.exists({
      where: {
        board: { id: boardId },
        user: { id: userId },
      },
    });
  }
}
