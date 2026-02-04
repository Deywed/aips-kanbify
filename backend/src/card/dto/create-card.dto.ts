import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  dueDate?: Date;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @IsOptional()
  tagIds?: string[];
}
