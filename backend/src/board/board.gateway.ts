import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { BoardRoleGuard } from 'src/common/guards/board-role.guard';
import { SOCKET_EVENTS } from 'src/common/constants/socket-events.constants';

type BoardRoomPayload = {
  boardId: string;
};

@WebSocketGateway({
  namespace: '/boards',
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:5173',
    credentials: true,
  },
})
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(BoardGateway.name);

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      this.logger.warn('Connection attempt without token');
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      const userId = payload.sub;
      client.data.userId = userId;
      this.logger.log(`Socket connected: ${userId}`);
    } catch (error) {
      this.logger.error('Invalid token:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.logger.log(`Socket disconnected: ${userId}`);
    }
  }

  @UseGuards(BoardRoleGuard)
  @SubscribeMessage(SOCKET_EVENTS.BOARD.JOIN)
  async handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: BoardRoomPayload,
  ) {
    const userId = client.data?.userId as string | undefined;
    const boardId = payload?.boardId;

    if (!userId) {
      return { ok: false, reason: 'Unauthorized' };
    }

    if (!boardId) {
      return { ok: false, reason: 'Missing boardId' };
    }

    const room = this.getBoardRoom(boardId);
    client.join(room);
    this.logger.log(`User ${userId} joined ${room}`);

    return { ok: true, boardId };
  }

  @SubscribeMessage(SOCKET_EVENTS.BOARD.LEAVE)
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: BoardRoomPayload,
  ) {
    const boardId = payload?.boardId;

    if (!boardId) {
      return { ok: false, reason: 'Missing boardId' };
    }

    const room = this.getBoardRoom(boardId);
    client.leave(room);

    return { ok: true, boardId };
  }

  emitToBoard(boardId: string, event: string, data: unknown) {
    this.server.to(this.getBoardRoom(boardId)).emit(event, data);
  }

  private getBoardRoom(boardId: string) {
    return `board:${boardId}`;
  }
}
