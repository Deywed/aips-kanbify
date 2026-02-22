export class CardDeletedEvent {
  constructor(
    public readonly boardId: string,
    public readonly columnId: string,
    public readonly cardId: string,
    public readonly actorId: string,
  ) {}
}
