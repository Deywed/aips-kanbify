import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CardHistory,
  CardActionType,
  CardHistoryPayload,
} from './entity/card-history.entity';

@Injectable()
export class CardHistoryService {
  constructor(
    @InjectRepository(CardHistory)
    private readonly cardHistoryRepo: Repository<CardHistory>,
  ) {}

  async record(
    cardId: string,
    actorId: string,
    action: CardActionType,
    payload: CardHistoryPayload = null,
  ): Promise<CardHistory> {
    const entry = this.cardHistoryRepo.create({
      card: { id: cardId },
      actor: { id: actorId },
      action,
      payload,
    });
    return this.cardHistoryRepo.save(entry);
  }

  async getHistory(cardId: string): Promise<CardHistory[]> {
    return this.cardHistoryRepo.find({
      where: { card: { id: cardId } },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }
}
