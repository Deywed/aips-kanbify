import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  title: string;
}
