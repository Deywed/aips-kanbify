import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  return {
    type: 'postgres',
    url: databaseUrl,
    autoLoadEntities: true,
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    synchronize: nodeEnv !== 'production',
    ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  };
};
