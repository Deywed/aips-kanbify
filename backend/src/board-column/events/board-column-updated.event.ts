export class BoardColumnUpdatedEvent {
  constructor(
    public readonly boardId: string,
    public readonly columnId: string,
    public readonly title: string,
    public readonly actorId: string,
  ) {}
}
