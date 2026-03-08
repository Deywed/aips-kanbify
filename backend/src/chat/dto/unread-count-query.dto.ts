import { IsOptional } from 'class-validator';

export class UnreadCountQueryDto {
  @IsOptional()
  lastSeenAt?: string;
}
