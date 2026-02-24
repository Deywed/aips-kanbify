import { useCallback, useMemo, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';

import type { Card } from '@/types/board.types';

import { useBoardColumns, useIsBoardLoading } from '@/stores/board.store';

import { useMoveCardMutation } from '@/mutations/cards/useMoveCardMutation';

import { BoardAdminGuard } from '@/components/guards/BoardAdminGuard';

import H4 from '@/components/ui/typography/H4';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import BlockUI from '@/components/common/BlockUI';

import BoardColumnDialog from './BoardColumnDialog';
import BoardColumnDropdown from './BoardColumnDropdown';
import ColumnCards from '../cards/ColumnCards';

type BoardColumnsProps = {
  isError?: boolean;
};

/**
 * Derive a card ordering map from board columns:
 * { [columnId]: [cardId1, cardId2, ...] }
 */
function deriveItems(
  columns: { id: string; cards: Card[] }[],
): Record<string, string[]> {
  const items: Record<string, string[]> = {};
  for (const col of columns) {
    items[col.id] = [...col.cards]
      .sort((a, b) => a.position - b.position)
      .map((c) => c.id);
  }
  return items;
}

/**
 * Build a flat lookup map of all cards by ID.
 */
function buildCardsMap(
  columns: { id: string; cards: Card[] }[],
): Map<string, Card> {
  const map = new Map<string, Card>();
  for (const col of columns) {
    for (const card of col.cards) {
      map.set(card.id, card);
    }
  }
  return map;
}

const BoardColumns = ({ isError }: BoardColumnsProps) => {
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const boardColumns = useBoardColumns();
  const isBoardLoading = useIsBoardLoading();

  const moveCardMutation = useMoveCardMutation();

  // Derive card ordering from store (stable between drag events)
  const storeItems = useMemo(() => deriveItems(boardColumns), [boardColumns]);

  // Flat lookup map for card data
  const cardsMap = useMemo(() => buildCardsMap(boardColumns), [boardColumns]);

  // Drag override: while dragging or while the move API is pending,
  // this holds the visual card ordering. null = use storeItems.
  const [dragOverride, setDragOverride] = useState<Record<
    string,
    string[]
  > | null>(null);

  // Ref to keep drag override accessible in event handlers without stale closures
  const dragOverrideRef = useRef<Record<string, string[]> | null>(null);

  // Current items for rendering
  const items = dragOverride ?? storeItems;

  const handleDragStart = useCallback(() => {
    // Snapshot current store items as the drag starting state
    dragOverrideRef.current = null;
  }, []);

  const handleDragOver = useCallback(
    (
      event: Parameters<
        NonNullable<React.ComponentProps<typeof DragDropProvider>['onDragOver']>
      >[0],
    ) => {
      setDragOverride((prev) => {
        const next = move(prev ?? storeItems, event);
        dragOverrideRef.current = next;
        return next;
      });
    },
    [storeItems],
  );

  const handleDragEnd = useCallback(
    (
      event: Parameters<
        NonNullable<React.ComponentProps<typeof DragDropProvider>['onDragEnd']>
      >[0],
    ) => {
      if (event.canceled) {
        dragOverrideRef.current = null;
        setDragOverride(null);
        return;
      }

      const currentDragItems = dragOverrideRef.current ?? storeItems;
      const newItems = move(currentDragItems, event);
      dragOverrideRef.current = newItems;
      setDragOverride(newItems);

      const source = event.operation?.source;
      if (!source) {
        dragOverrideRef.current = null;
        setDragOverride(null);
        return;
      }

      const cardId = String(source.id);

      // Find source column from store items (pre-drag state)
      let sourceColumnId = '';
      for (const [colId, cardIds] of Object.entries(storeItems)) {
        if (cardIds.includes(cardId)) {
          sourceColumnId = colId;
          break;
        }
      }

      // Find target column and index from new items
      let targetColumnId = '';
      let targetIndex = -1;
      for (const [colId, cardIds] of Object.entries(newItems)) {
        const idx = cardIds.indexOf(cardId);
        if (idx !== -1) {
          targetColumnId = colId;
          targetIndex = idx;
          break;
        }
      }

      if (!sourceColumnId || !targetColumnId || targetIndex < 0) {
        dragOverrideRef.current = null;
        setDragOverride(null);
        return;
      }

      // Check if nothing changed
      if (sourceColumnId === targetColumnId) {
        const oldIndex = storeItems[sourceColumnId]?.indexOf(cardId) ?? -1;
        if (oldIndex === targetIndex) {
          dragOverrideRef.current = null;
          setDragOverride(null);
          return;
        }
      }

      // Determine afterCardId for the backend API
      const afterCardId =
        targetIndex > 0 ? newItems[targetColumnId][targetIndex - 1] : null;

      moveCardMutation.mutate(
        {
          sourceColumnId,
          cardId,
          newColumnId: targetColumnId,
          afterCardId,
        },
        {
          onSettled: () => {
            // Clear override: store will reflect the new order on success,
            // or the old order on failure (card reverts visually)
            dragOverrideRef.current = null;
            setDragOverride(null);
          },
        },
      );
    },
    [storeItems, moveCardMutation],
  );

  return (
    <>
      <BlockUI
        isLoading={isBoardLoading}
        isError={isError}
        isEmpty={boardColumns.length === 0}
        emptyContent={
          <div>
            <Button onClick={() => setIsAddColumnOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} size={16} /> Add column
            </Button>
          </div>
        }
        className="h-full"
      >
        <DragDropProvider
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <ScrollArea className="h-full w-full pb-4">
            <div className="inline-flex gap-4 pb-2" tabIndex={-1}>
              {boardColumns.map((column) => {
                const orderedCards = (items[column.id] ?? [])
                  .map((cardId) => cardsMap.get(cardId))
                  .filter(Boolean) as Card[];

                return (
                  <div
                    className="bg-card flex h-full w-xs flex-col gap-4 rounded-md border p-2 shadow"
                    key={column.id}
                  >
                    <div className="flex items-center justify-between gap-2 p-2">
                      <div className="flex items-center gap-2">
                        <H4>{column.title}</H4>
                        <Badge variant="secondary">{orderedCards.length}</Badge>
                      </div>
                      <BoardAdminGuard>
                        <BoardColumnDropdown column={column} />
                      </BoardAdminGuard>
                    </div>

                    <ColumnCards columnId={column.id} cards={orderedCards} />
                  </div>
                );
              })}

              <div
                className="text-muted-foreground hover:bg-card/50 hover:text-foreground flex h-30 w-xs cursor-pointer items-center justify-center gap-2 rounded-md border shadow transition-colors hover:border-solid dark:border-dashed"
                onClick={() => setIsAddColumnOpen(true)}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} /> Add column
              </div>
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DragDropProvider>
      </BlockUI>

      <BoardColumnDialog isOpen={isAddColumnOpen} open={setIsAddColumnOpen} />
    </>
  );
};

export default BoardColumns;
