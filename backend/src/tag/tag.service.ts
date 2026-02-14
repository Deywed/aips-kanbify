import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Tag } from './entity/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { EVENTS } from 'src/common/constants/events.constants';
import { BoardTagAddedEvent } from './events/board-tag-added.event';
import { BoardTagRemovedEvent } from './events/board-tag-removed.event';
import { BoardTagUpdatedEvent } from './events/board-tag-updated.event';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private eventEmitter: EventEmitter2,
  ) {}

  async getAllTags(boardId: string) {
    return this.tagRepository.find({
      where: { board: { id: boardId } },
    });
  }

  async createTag(boardId: string, dto: CreateTagDto, currentUserId: string) {
    const exists = await this.tagRepository.findOneBy({
      name: dto.name,
      board: { id: boardId },
    });

    if (exists) {
      throw new BadRequestException('Tag with this name already exists');
    }

    const tag = this.tagRepository.create({
      ...dto,
      board: { id: boardId },
    });

    try {
      const saved = await this.tagRepository.save(tag);
      this.eventEmitter.emit(
        EVENTS.BOARD_TAG_CREATED,
        new BoardTagAddedEvent(saved, currentUserId),
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create tag');
    }

    return tag;
  }

  async deleteTag(boardId: string, id: string, currentUserId: string) {
    const exists = await this.tagRepository.findOneBy({
      id,
      board: { id: boardId },
    });

    if (!exists) throw new BadRequestException('Tag not found');

    try {
      await this.tagRepository.delete({ id });
      this.eventEmitter.emit(
        EVENTS.BOARD_TAG_DELETED,
        new BoardTagRemovedEvent(boardId, id, currentUserId),
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete tag');
    }

    return { id };
  }

  async updateTag(
    boardId: string,
    id: string,
    dto: UpdateTagDto,
    currentUserId: string,
  ) {
    const tag = await this.tagRepository.findOneBy({
      id,
      board: { id: boardId },
    });

    if (!tag) throw new BadRequestException('Tag not found');

    Object.assign(tag, dto);

    try {
      const saved = await this.tagRepository.save(tag);
      this.eventEmitter.emit(
        EVENTS.BOARD_TAG_UPDATED,
        new BoardTagUpdatedEvent(boardId, id, dto.name ?? '', currentUserId),
      );
      return saved;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update tag');
    }
  }

  async validateAndGetTags(boardId: string, tagIds?: string[]): Promise<Tag[]> {
    if (!tagIds || tagIds.length === 0) {
      return [];
    }

    const tags = await this.tagRepository.find({
      where: {
        id: In(tagIds),
        board: { id: boardId },
      },
    });

    if (tags.length !== tagIds.length) {
      throw new BadRequestException(
        'One or more tags were not found on this board',
      );
    }

    return tags;
  }
}
