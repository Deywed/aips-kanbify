import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository, MoreThan, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EVENTS } from 'src/common/constants/events.constants';
import { POSITION_GAP } from 'src/common/constants/positions.constant';

import { BoardColumnService } from 'src/board-column/board-column.service';
import { BoardMembersService } from 'src/board-members/board-members.service';

import { BoardColumn } from 'src/board-column/entity/board-column.entity';
import { Card } from './entity/card.entity';

import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

import { CardCreatedEvent } from './events/card-created.event';
import { CardDeletedEvent } from './events/card-deleted.event';
import { CardUpdatedEvent } from './events/card-updated.event';
import { CardMovedEvent } from './events/card-moved.event';

import { TagService } from 'src/tag/tag.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,
    @InjectRepository(BoardColumn)
    private readonly columnRepo: Repository<BoardColumn>,
    private readonly boardColumnService: BoardColumnService,
    private readonly tagService: TagService,
    private readonly boardMembersService: BoardMembersService,
    private readonly dataSource: DataSource,
    private eventEmitter: EventEmitter2,
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

    // 4. New card goes on first position in column
    const position = await this.boardColumnService.getNextTopPosition(columnId);

    // 5. Creating Card instance (do not save yet)
    const newCard = this.cardRepo.create({
      ...dto,
      position,
      column,
      createdBy: { id: userId },
      assignedTo: dto.assignedToId ? { id: dto.assignedToId } : undefined,
      tags,
    });

    // 6. Transactional saving
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Save the card (and tags automatically)
      const savedCard = await queryRunner.manager.save(Card, newCard);

      const createdCard = await queryRunner.manager.findOne(Card, {
        where: { id: savedCard.id },
        relations: ['column', 'createdBy', 'assignedTo', 'tags'],
      });

      if (!createdCard) {
        throw new InternalServerErrorException('Failed to load created card');
      }

      await queryRunner.commitTransaction();

      this.eventEmitter.emit(
        EVENTS.BOARD_COLUMN_CARD_CREATED,
        new CardCreatedEvent(boardId, columnId, createdCard, userId),
      );

      return createdCard;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Create Card Error:', error);
      throw new InternalServerErrorException('Failed to create card');
    } finally {
      await queryRunner.release();
    }
  }

  async updateCard(
    boardId: string,
    columnId: string,
    cardId: string,
    dto: UpdateCardDto,
    currentUserId: string,
  ) {
    const card = await this.cardRepo.findOne({
      where: {
        id: cardId,
        column: { id: columnId, board: { id: boardId } },
      },
      relations: ['column', 'createdBy', 'assignedTo', 'tags'],
    });

    if (!card) {
      throw new NotFoundException('Card not found on this column and board');
    }

    const oldCard = {
      ...card,
      column: card.column ? { ...card.column } : card.column,
      createdBy: card.createdBy ? { ...card.createdBy } : card.createdBy,
      assignedTo: card.assignedTo ? { ...card.assignedTo } : undefined,
      tags: card.tags ? [...card.tags] : [],
    } as Card;

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

    const tags =
      dto.tagIds !== undefined
        ? await this.tagService.validateAndGetTags(boardId, dto.tagIds)
        : undefined;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title, description, dueDate } = dto;

      Object.assign(card, {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate }),
        ...('assignedToId' in dto && {
          assignedTo: dto.assignedToId
            ? ({ id: dto.assignedToId } as Card['assignedTo'])
            : null,
        }),
        ...(tags !== undefined && { tags }),
      });

      const savedCard = await queryRunner.manager.save(Card, card);

      const updatedCard = await queryRunner.manager.findOne(Card, {
        where: { id: savedCard.id },
        relations: ['column', 'createdBy', 'assignedTo', 'tags'],
      });

      if (!updatedCard) {
        throw new InternalServerErrorException('Failed to load updated card');
      }

      await queryRunner.commitTransaction();

      this.eventEmitter.emit(
        EVENTS.BOARD_COLUMN_CARD_UPDATED,
        new CardUpdatedEvent(
          boardId,
          columnId,
          updatedCard,
          currentUserId,
          oldCard,
        ),
      );

      return updatedCard;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Update Card Error:', error);
      throw new InternalServerErrorException('Failed to update card');
    } finally {
      await queryRunner.release();
    }
  }

  async removeCard(
    boardId: string,
    columnId: string,
    cardId: string,
    currentUserId: string,
  ) {
    const card = await this.cardRepo.findOne({
      where: {
        id: cardId,
        column: { id: columnId, board: { id: boardId } },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found on this column and board');
    }

    try {
      await this.cardRepo.remove(card);
      this.eventEmitter.emit(
        EVENTS.BOARD_COLUMN_CARD_DELETED,
        new CardDeletedEvent(boardId, columnId, cardId, currentUserId),
      );
    } catch (error) {
      console.error('Remove Card Error:', error);
      throw new InternalServerErrorException('Failed to remove card');
    }

    return { id: cardId };
  }

  async moveCard(
    boardId: string,
    columnId: string,
    cardId: string,
    dto: MoveCardDto,
    currentUserId: string,
  ) {
    const card = await this.cardRepo.findOne({
      where: {
        id: cardId,
        column: { id: columnId, board: { id: boardId } },
      },
      relations: ['column'],
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const newColumn = await this.columnRepo.findOne({
      where: { id: dto.newColumnId, board: { id: boardId } },
    });

    if (!newColumn) {
      throw new NotFoundException('Target column not found');
    }

    if (dto.afterCardId === cardId) {
      throw new BadRequestException('Cannot move card after itself');
    }

    const oldColumnName = card.column.title;

    let newPosition: number;

    if (!dto.afterCardId) {
      // Move to the top of the new column
      const firstCard = await this.cardRepo.findOne({
        where: { column: { id: dto.newColumnId }, id: Not(cardId) },
        order: { position: 'ASC' },
      });

      if (!firstCard) {
        newPosition = POSITION_GAP;
      } else {
        newPosition = Number(firstCard.position) - POSITION_GAP;
      }
    } else {
      // Move after a specific card
      const afterCard = await this.cardRepo.findOne({
        where: { id: dto.afterCardId, column: { id: dto.newColumnId } },
      });

      if (!afterCard) {
        throw new NotFoundException('afterCardId not found in target column');
      }

      const nextCard = await this.cardRepo.findOne({
        where: {
          column: { id: dto.newColumnId },
          position: MoreThan(afterCard.position),
          id: Not(cardId),
        },
        order: { position: 'ASC' },
      });

      if (!nextCard) {
        newPosition = Number(afterCard.position) + POSITION_GAP;
      } else {
        newPosition =
          (Number(afterCard.position) + Number(nextCard.position)) / 2;
      }
    }

    card.column = newColumn;
    card.position = newPosition;

    try {
      const savedCard = await this.cardRepo.save(card);

      const movedCard = await this.cardRepo.findOne({
        where: { id: savedCard.id },
        relations: ['column', 'createdBy', 'assignedTo', 'tags'],
      });

      if (!movedCard) {
        throw new InternalServerErrorException('Failed to load moved card');
      }

      this.eventEmitter.emit(
        EVENTS.BOARD_COLUMN_CARD_MOVED,
        new CardMovedEvent(
          boardId,
          columnId,
          dto.newColumnId,
          oldColumnName,
          newColumn.title,
          cardId,
          newPosition,
          movedCard,
          currentUserId,
        ),
      );

      return movedCard;
    } catch (error) {
      console.error('Move Card Error:', error);
      throw new InternalServerErrorException('Failed to move card');
    }
  }

  async getUsersAssignedCards(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<Card>> {
    const { page = 1, pageSize = 10 } = query;

    const [cards, total] = await this.cardRepo.findAndCount({
      where: { assignedTo: { id: userId } },
      relations: ['column.board', 'tags'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: cards,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
