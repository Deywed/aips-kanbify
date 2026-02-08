import { Controller, Get, Query, Req } from '@nestjs/common';

import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  searchUsers(
    @Req() req: Request,
    @Query('query') query: string = '',
    @Query('excludeBoardId') excludeBoardId: string,
  ) {
    const user = req['user'] as JwtPayload;
    return this.usersService.searchUsers(query, excludeBoardId, user.sub);
  }
}
