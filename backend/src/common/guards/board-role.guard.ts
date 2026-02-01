// common/guards/board-role.guard.ts

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import {
  BoardMember,
  BoardRole,
} from 'src/board-members/entity/board-members.entity';

import { BOARD_ROLES_KEY } from '../decorators/board-role.decorator';

@Injectable()
export class BoardRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @InjectRepository(BoardMember)
    private readonly memberRepo: Repository<BoardMember>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<BoardRole[]>(
      BOARD_ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    // Ako ruta nema @BoardRoleGuard → samo proveri da je member
    if (!requiredRoles) {
      return this.validateMembership(ctx);
    }

    const request = ctx.switchToHttp().getRequest();

    const user = request.user as JwtPayload;
    const boardId = request.params.boardId ?? request.params.id;

    if (!user || !boardId) {
      throw new BadRequestException('User or board ID missing');
    }

    const membership = await this.memberRepo.findOne({
      where: {
        board: { id: boardId },
        user: { id: user.sub },
      },
      relations: ['board', 'user'],
    });

    if (!membership) {
      throw new NotFoundException('You are not a member of this board');
    }

    if (!requiredRoles.includes(membership.role)) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    return true;
  }

  private async validateMembership(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as JwtPayload;
    const boardId = request.params.boardId ?? request.params.id;

    if (!user || !boardId) return false;

    const exists = await this.memberRepo.exists({
      where: {
        board: { id: boardId },
        user: { id: user.sub },
      },
    });

    if (!exists) {
      throw new ForbiddenException('You are not a member of this board');
    }

    return true;
  }
}
