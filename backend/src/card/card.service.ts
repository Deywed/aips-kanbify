import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BoardColumnService } from 'src/board-column/board-column.service';
import { BoardMembersService } from 'src/board-members/board-members.service';

import { Board } from 'src/board/entity/board.entity';
import { BoardColumn } from 'src/board-column/entity/board-column.entity';
import { CardTag } from 'src/tag/entity/card-tag.entity';
import { Card } from './entity/card.entity';

import { CreateCardDto } from './dto/create-card.dto';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
    @InjectRepository(BoardColumn)
    private readonly columnRepo: Repository<BoardColumn>,
    private readonly boardColumnService: BoardColumnService,
    private readonly tagService: TagService,
    private readonly boardMembersService: BoardMembersService,
    private readonly dataSource: DataSource,
  ) {}

  async createCard(
    boardId: string,
    columnId: string,
    userId: string,
    dto: CreateCardDto,
  ) {
    // 1. Check if column exists on the board
    const column = await this.columnRepo.findOne({
      where: { id: columnId, board: { id: boardId } },
    });

    if (!column) {
      throw new NotFoundException('Column not found on this board');
    }

    // 2. Is user that card is assigned to a member of the board?
    if (dto.assignedToId) {
      const isMember = await this.boardMembersService.isUserMemberOfBoard(
        boardId,
        dto.assignedToId,
      );

      if (!isMember) {
        throw new BadRequestException(
          'Assigned user is not a member of the board',
        );
      }
    }

    // 3. Validate and prepare tags
    const tags = await this.tagService.validateAndGetTags(boardId, dto.tagIds);
    const cardTags = tags.map((tag) => {
      const cardTag = new CardTag();
      cardTag.tag = tag;
      return cardTag;
    });

    // 4. New card goes on first position in column
    const position = await this.boardColumnService.getNextTopPosition(columnId);

    // 5. Creating Card instance (do not save yet)
    const newCard = this.cardRepo.create({
      ...dto,
      position,
      column,
      createdBy: { id: userId },
      assignedTo: dto.assignedToId ? { id: dto.assignedToId } : undefined,
      tags: cardTags,
    });

    // 6. Transactional saving
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Save the card (and tags automatically)
      const savedCard = await queryRunner.manager.save(Card, newCard);

      await queryRunner.commitTransaction();

      return this.getCardById(savedCard.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Create Card Error:', error);
      throw new InternalServerErrorException('Failed to create card');
    } finally {
      await queryRunner.release();
    }
  }

  private async getCardById(id: string) {
    return this.cardRepo.findOne({
      where: { id },
      relations: ['tags', 'tags.tag', 'assignedTo', 'createdBy', 'column'],
    });
  }
}
