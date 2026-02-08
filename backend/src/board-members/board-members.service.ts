import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { BoardMember, BoardRole } from './entity/board-members.entity';
import { Board } from 'src/board/entity/board.entity';
import { User } from 'src/users/entity/user.entity';

import { EVENTS } from 'src/common/constants/events.constants';
import { AddMemberDto } from './dto/add-member.dto';
import { BoardMemberAddedEvent } from './events/board-member-added.event';
import { BoardMemberResponseDto } from './dto/board-member-response.dto';

@Injectable()
export class BoardMembersService {
  constructor(
    @InjectRepository(BoardMember)
    private readonly memberRepo: Repository<BoardMember>,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getMembers(boardId: string) {
    const members = await this.memberRepo.find({
      where: { board: { id: boardId } },
      relations: ['user'],
    });

    return BoardMemberResponseDto.fromEntities(members);
  }

  async addMember(boardId: string, dto: AddMemberDto, currentUserId: string) {
    const board = await this.boardRepo.findOneBy({ id: boardId });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const user = await this.userRepo.findOneBy({ id: dto.userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMember = await this.isUserMemberOfBoard(boardId, dto.userId);

    if (isMember) {
      throw new BadRequestException('User is already a member of the board');
    }

    const member = this.memberRepo.create({
      board,
      user,
      role: dto.role,
    });

    try {
      await this.memberRepo.save(member);
      this.eventEmitter.emit(
        EVENTS.BOARD_MEMBER_ADDED,
        new BoardMemberAddedEvent(boardId, dto.userId, currentUserId, dto.role),
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to add member to the board',
      );
    }

    return BoardMemberResponseDto.fromEntity(member);
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

    try {
      targetMember.role = newRole;
      const saved = await this.memberRepo.save(targetMember);

      // TODO: Emit an event for role change

      return BoardMemberResponseDto.fromEntity(saved);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update member role');
    }
  }

  // TODO: All cards where this user is assigned should be unassigned
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

      // TODO: Emit an event for member removal
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
