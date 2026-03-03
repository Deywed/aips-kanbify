import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
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
    private jwtService: JwtService,

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

    const { user, boardId } = await this.getAuthContext(ctx);

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
    const { user, boardId } = await this.getAuthContext(ctx);

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

  private async getAuthContext(
    ctx: ExecutionContext,
  ): Promise<{ user: JwtPayload; boardId: string }> {
    if (ctx.getType() === 'ws') {
      const client = ctx.switchToWs().getClient<Socket>();
      const data = ctx.switchToWs().getData();

      const token = client.handshake.auth?.token;
      if (!token) throw new UnauthorizedException('Missing token');

      let user: JwtPayload;
      try {
        user = (await this.jwtService.verifyAsync(token)) as JwtPayload;
        client.data.user = user;
      } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const boardId = data?.boardId;

      if (!boardId) {
        throw new BadRequestException('Board ID missing in payload');
      }

      return { user, boardId: String(boardId) };
    }

    // HTTP context
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    const boardId = request.params.boardId ?? request.params.id;

    if (!user || !boardId) {
      throw new BadRequestException('User or board ID missing');
    }

    return { user, boardId };
  }
}
