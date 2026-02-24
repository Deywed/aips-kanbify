export class BoardColumnReorderedEvent {
  constructor(
    public readonly boardId: string,
    public readonly columnId: string,
    public readonly newPosition: number,
    public readonly actorId: string,
  ) {}
}
