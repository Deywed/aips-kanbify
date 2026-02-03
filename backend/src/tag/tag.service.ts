import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getAllTags() {
    return this.tagRepository.find();
  }

  async getById(id: string) {
    const tag = await this.tagRepository.findOneBy({ id });
    if (!tag) throw new BadRequestException('Tag not found');
    return tag;
  }

  async createTag(dto: CreateTagDto) {
    const exists = await this.tagRepository.findOneBy({ name: dto.name });
    if (exists)
      throw new BadRequestException('Tag with this name already exists');

    const tag = this.tagRepository.create(dto);
    return this.tagRepository.save(tag);
  }

  async deleteTag(id: string) {
    const exists = await this.tagRepository.findOneBy({ id });
    if (!exists) throw new BadRequestException('Tag not found');

    await this.tagRepository.delete({ id });
    return { message: 'Tag deleted successfully' };
  }

  async updateTag(id: string, dto: UpdateTagDto) {
    const tag = await this.tagRepository.findOneBy({ id });
    if (!tag) throw new BadRequestException('Tag not found');

    tag.name = dto.name ?? tag.name;
    return this.tagRepository.save(tag);
  }
}
