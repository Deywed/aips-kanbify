import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Tag } from './entity/tag.entity';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getAllTags(boardId: string) {
    return this.tagRepository.find({
      where: { board: { id: boardId } },
    });
  }

  async createTag(boardId: string, dto: CreateTagDto) {
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
      await this.tagRepository.save(tag);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create tag');
    }

    return tag;
  }

  async deleteTag(boardId: string, id: string) {
    const exists = await this.tagRepository.findOneBy({
      id,
      board: { id: boardId },
    });

    if (!exists) throw new BadRequestException('Tag not found');

    try {
      await this.tagRepository.delete({ id });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete tag');
    }

    return { id };
  }

  async updateTag(boardId: string, id: string, dto: UpdateTagDto) {
    const tag = await this.tagRepository.findOneBy({
      id,
      board: { id: boardId },
    });

    if (!tag) throw new BadRequestException('Tag not found');

    Object.assign(tag, dto);

    try {
      await this.tagRepository.save(tag);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update tag');
    }

    return tag;
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
