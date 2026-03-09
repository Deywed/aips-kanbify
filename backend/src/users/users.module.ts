import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CardModule } from 'src/card/card.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CloudinaryModule, CardModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
