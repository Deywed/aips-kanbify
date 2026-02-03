import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entity/card.entity';
import { Column, Not, Repository } from 'typeorm';
import { Board } from 'src/board/entity/board.entity';
import { BoardColumn } from 'src/board-column/entity/board-column.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { BoardColumnService } from 'src/board-column/board-column.service';
import { UpdateCardDto } from './dto/update-card.dto';
import { BoardMembersService } from 'src/board-members/board-members.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardColumn)
    private readonly columnRepository: Repository<BoardColumn>,

    private readonly boardColumnService: BoardColumnService,

    private readonly boardMembersService: BoardMembersService,
  ) {}

  //get cards by boardId
  async getCardsByBoardId(boardId: string) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['columns', 'columns.cards'],
    });
    if (!board) throw new NotFoundException('Board not found');
    return board.columns.flatMap((column) => column.cards);
  }

  //create card
  async createCard(
    boardId: string,
    columnId: string,
    dto: CreateCardDto,
    userId: string,
  ) {
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

    const column = await this.boardColumnService.getColumnById(
      boardId,
      columnId,
    );

    const firstCard = await this.getFirstCardInColumn(columnId);
    const position = firstCard ? Number(firstCard.position) - 1 : 1;

    const card = this.cardRepository.create({
      ...dto,
      position,
      column,
      createdBy: { id: userId },
      assignedTo: { id: dto.assignedToId },
    });
    try {
      await this.cardRepository.save(card);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create card');
    }
    return card;
  }
  //update card

  async updateCard(
    boardId: string,
    columnId: string,
    cardId: string,
    dto: UpdateCardDto,
  ) {
    const column = await this.boardColumnService.getColumnById(
      boardId,
      columnId,
    );
    const card = await this.cardRepository.findOneBy({
      id: cardId,
      column: { id: column.id },
    });
  }

  async getFirstCardInColumn(columnId: string) {
    return await this.cardRepository.findOne({
      where: {
        column: { id: columnId }, // Filtriramo po ID-u kolone
      },
      order: {
        position: 'ASC', // Sortiramo od najmanjeg ka najvećem
      },
    });
  }
}
