export class BoardTagUpdatedEvent {
  constructor(
    public readonly boardId: string,
    public readonly tagId: string,
    public readonly name: string,
    public readonly actorId: string,
  ) {}
}
