import { IsOptional, IsUUID } from 'class-validator';

export class ReorderColumnDto {
  @IsOptional()
  @IsUUID()
  afterId?: string | null;
}
