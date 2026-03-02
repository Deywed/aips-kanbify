import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CLOUDINARY_AVATARS_FOLDER } from 'src/cloudinary/constants';

import { BoardMember } from 'src/board-members/entity/board-members.entity';
import { User } from './entity/user.entity';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  searchUsers(query: string, excludeBoardId?: string, currentUserId?: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('(user.email ILIKE :query OR user.username ILIKE :query)', {
        query: `%${query}%`,
      })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('bm.userId')
          .from(BoardMember, 'bm')
          .where('bm.boardId = :excludeBoardId')
          .andWhere('bm.userId != :currentUserId')
          .getQuery();
        return 'user.id NOT IN ' + subQuery;
      })
      .setParameter('excludeBoardId', excludeBoardId)
      .setParameter('currentUserId', currentUserId)
      .limit(10)
      .getMany();
  }

  async updateUserAvatar(image: Express.Multer.File, userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const uploadResult = await this.cloudinaryService.uploadImage(
        image.buffer,
        `${CLOUDINARY_AVATARS_FOLDER}/${userId}`,
      );

      user.avatarUrl = uploadResult.secure_url;
      user.avatarPublicId = uploadResult.public_id;

      const savedUser = await this.userRepo.save(user);

      return savedUser;
    } catch (error) {
      this.logger.error(
        `Failed to update avatar for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to update avatar image');
    }
  }

  async deleteUserAvatar(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      if (user.avatarPublicId) {
        await this.cloudinaryService.deleteImage(user.avatarPublicId);

        user.avatarUrl = null;
        user.avatarPublicId = null;

        const savedUser = await this.userRepo.save(user);

        return savedUser;
      }

      throw new NotFoundException('User does not have an avatar to delete');
    } catch (error) {
      this.logger.error(
        `Failed to delete avatar for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete avatar image');
    }
  }
}
