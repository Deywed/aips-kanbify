import { CreateCardDto } from './create-card.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCardDto extends PartialType(CreateCardDto) {}
