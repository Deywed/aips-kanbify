import { Tag } from '../entity/tag.entity';

export class BoardTagAddedEvent {
  constructor(
    public readonly tag: Tag,
    public readonly actorId: string,
  ) {}
}
