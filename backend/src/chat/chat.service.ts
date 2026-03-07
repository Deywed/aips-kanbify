import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';

import { ChatMessage } from './entity/chat-message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly messageRepo: Repository<ChatMessage>,
  ) {}

  async createMessage(
    boardId: string,
    senderId: string,
    dto: SendMessageDto,
  ): Promise<ChatMessage> {
    const message = this.messageRepo.create({
      content: dto.content,
      board: { id: boardId },
      sender: { id: senderId },
    });

    const saved = await this.messageRepo.save(message);

    return this.messageRepo.findOneOrFail({
      where: { id: saved.id },
      relations: ['sender'],
    });
  }

  async getMessages(
    boardId: string,
    limit: number,
    before?: string,
  ): Promise<ChatMessage[]> {
    const where: any = { board: { id: boardId } };

    if (before) {
      where.createdAt = LessThan(new Date(before));
    }

    return this.messageRepo.find({
      where,
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUnreadCount(boardId: string, lastSeenAt?: string): Promise<number> {
    if (!lastSeenAt) {
      return this.messageRepo.count({
        where: { board: { id: boardId } },
      });
    }

    return this.messageRepo.count({
      where: {
        board: { id: boardId },
        createdAt: MoreThan(new Date(lastSeenAt)),
      },
    });
  }
}
