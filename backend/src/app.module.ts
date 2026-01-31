import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmOptions } from './database/typeorm.config';

import { JwtGlobalModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { BoardMembersModule } from './board-members/board-members.module';
import { BoardColumnModule } from './board-column/board-column.module';
import { CardModule } from './card/card.module';
import { TagModule } from './tag/tag.module';
import { CardHistoryModule } from './card-history/card-history.module';
import { NotificationsModule } from './notifications/notifications.module';

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
    JwtGlobalModule,
    AuthModule,
    BoardModule,
    BoardMembersModule,
    BoardColumnModule,
    CardModule,
    TagModule,
    CardHistoryModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
