export class BoardColumnRemovedEvent {
  constructor(
    public readonly boardId: string,
    public readonly columnId: string,
    public readonly actorId: string,
  ) {}
}
