import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';
import { createTypeOrmOptions } from './database/typeorm.config';

import { JwtGlobalModule } from './jwt/jwt.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { BoardMembersModule } from './board-members/board-members.module';
import { BoardColumnModule } from './board-column/board-column.module';
import { CardModule } from './card/card.module';
import { TagModule } from './tag/tag.module';
import { CardHistoryModule } from './card-history/card-history.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService),
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      maxListeners: 10,
    }),
    JwtGlobalModule,
    CloudinaryModule,
    AuthModule,
    BoardModule,
    BoardMembersModule,
    BoardColumnModule,
    CardModule,
    TagModule,
    CardHistoryModule,
    NotificationsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
