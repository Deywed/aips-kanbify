import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

import { ImageUploadInterceptor } from 'src/common/interceptors/image-upload.interceptor';

import { CardService } from 'src/card/card.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cardService: CardService,
  ) {}

  @Get('search')
  searchUsers(
    @Req() req: Request,
    @Query('query') query: string = '',
    @Query('excludeBoardId') excludeBoardId: string,
  ) {
    const user = req['user'] as JwtPayload;
    return this.usersService.searchUsers(query, excludeBoardId, user.sub);
  }

  @Get('assigned-cards')
  getAssignedCards(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const user = req['user'] as JwtPayload;
    return this.cardService.getUsersAssignedCards(user.sub, query);
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch()
  updateUserInfo(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req['user'] as JwtPayload;

    if (!updateUserDto.firstName || !updateUserDto.lastName) {
      throw new BadRequestException('First name and last name cannot be empty');
    }

    return this.usersService.updateUserInfo(updateUserDto, user.sub);
  }

  @Put('avatar')
  @UseInterceptors(ImageUploadInterceptor())
  updateUserAvatar(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const user = request['user'] as JwtPayload;
    return this.usersService.updateUserAvatar(image, user.sub);
  }

  @Delete('avatar')
  deleteUserAvatar(@Req() request: Request) {
    const user = request['user'] as JwtPayload;
    return this.usersService.deleteUserAvatar(user.sub);
  }
}
