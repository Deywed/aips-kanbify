import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class MoveCardDto {
  @IsNotEmpty()
  @IsUUID()
  newColumnId: string;

  @IsOptional()
  @IsUUID()
  afterCardId?: string | null;
}
