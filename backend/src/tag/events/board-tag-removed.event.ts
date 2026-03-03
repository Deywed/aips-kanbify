export class BoardTagRemovedEvent {
  constructor(
    public readonly boardId: string,
    public readonly tagId: string,
    public readonly actorId: string,
  ) {}
}
