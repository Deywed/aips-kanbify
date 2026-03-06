import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardHistory } from './entity/card-history.entity';
import { CardHistoryService } from './card-history.service';
import { CardHistoryListener } from './listeners/card-history.listener';
import { CardHistoryController } from './card-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CardHistory])],
  providers: [CardHistoryService, CardHistoryListener],
  exports: [CardHistoryService],
  controllers: [CardHistoryController],
})
export class CardHistoryModule {}
