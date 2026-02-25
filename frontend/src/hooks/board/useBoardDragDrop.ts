import { useCallback, useMemo, useRef, useState } from 'react';
import { move } from '@dnd-kit/helpers';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/dom';

type DragStartParam = Parameters<DragStartEvent>[0];
type DragOverParam = Parameters<DragOverEvent>[0];
type DragEndParam = Parameters<DragEndEvent>[0];

import type { Card, Column } from '@/types/board.types';

import { useMoveCardMutation } from '@/mutations/cards/useMoveCardMutation';
import { useReorderColumnMutation } from '@/mutations/columns/useReorderColumnMutation';

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

/** { [columnId]: [cardId, …] } sorted by position */
function deriveCardItems(columns: Column[]): Record<string, string[]> {
  const items: Record<string, string[]> = {};
  for (const col of columns) {
    items[col.id] = [...col.cards]
      .sort((a, b) => a.position - b.position)
      .map((c) => c.id);
  }
  return items;
}

/** Flat card lookup by ID */
function buildCardsMap(columns: Column[]): Map<string, Card> {
  const map = new Map<string, Card>();
  for (const col of columns) {
    for (const card of col.cards) {
      map.set(card.id, card);
    }
  }
  return map;
}

/** Column lookup by ID */
function buildColumnsMap(columns: Column[]): Map<string, Column> {
  const map = new Map<string, Column>();
  for (const col of columns) {
    map.set(col.id, col);
  }
  return map;
}

// ────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────

export function useBoardDragDrop(boardColumns: Column[]) {
  const moveCardMutation = useMoveCardMutation();
  const reorderColumnMutation = useReorderColumnMutation();

  // ── Derived store data ──────────────────────
  const storeCardItems = useMemo(
    () => deriveCardItems(boardColumns),
    [boardColumns],
  );
  const storeColumnOrder = useMemo(
    () => boardColumns.map((c) => c.id),
    [boardColumns],
  );
  const cardsMap = useMemo(() => buildCardsMap(boardColumns), [boardColumns]);
  const columnsMap = useMemo(
    () => buildColumnsMap(boardColumns),
    [boardColumns],
  );

  // ── Drag-override state ─────────────────────
  const [cardOverride, setCardOverride] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [columnOverride, setColumnOverride] = useState<string[] | null>(null);

  const cardOverrideRef = useRef<Record<string, string[]> | null>(null);
  const columnOverrideRef = useRef<string[] | null>(null);
  const dragTypeRef = useRef<string | null>(null);

  // ── Values for rendering ────────────────────
  const cardItems = cardOverride ?? storeCardItems;
  const columnOrder = columnOverride ?? storeColumnOrder;

  // ── Helpers for clearing state ──────────────
  const resetCardOverride = useCallback(() => {
    cardOverrideRef.current = null;
    setCardOverride(null);
  }, []);

  const resetColumnOverride = useCallback(() => {
    columnOverrideRef.current = null;
    setColumnOverride(null);
  }, []);

  const resetAll = useCallback(() => {
    resetCardOverride();
    resetColumnOverride();
  }, [resetCardOverride, resetColumnOverride]);

  // ── Drag handlers ───────────────────────────
  const handleDragStart = useCallback(
    (event: DragStartParam) => {
      dragTypeRef.current =
        event.operation?.source?.type != null
          ? String(event.operation.source.type)
          : null;
      resetAll();
    },
    [resetAll],
  );

  const handleDragOver = useCallback(
    (event: DragOverParam) => {
      if (dragTypeRef.current === 'column') {
        setColumnOverride((prev) => {
          const current = prev ?? storeColumnOrder;
          const source = event.operation?.source;
          const target = event.operation?.target;
          if (!source || !target) return current;

          const srcIdx = current.indexOf(String(source.id));
          const tgtIdx = current.indexOf(String(target.id));
          if (srcIdx === -1 || tgtIdx === -1) return current;

          const next = [...current];
          next.splice(srcIdx, 1);
          next.splice(tgtIdx, 0, String(source.id));
          columnOverrideRef.current = next;
          return next;
        });
      } else {
        setCardOverride((prev) => {
          const next = move(prev ?? storeCardItems, event);
          cardOverrideRef.current = next;
          return next;
        });
      }
    },
    [storeCardItems, storeColumnOrder],
  );

  const handleColumnDragEnd = useCallback(
    (event: DragEndParam) => {
      const source = event.operation?.source;
      if (!source) {
        resetColumnOverride();
        return;
      }

      const finalOrder = columnOverrideRef.current ?? storeColumnOrder;
      const columnId = String(source.id);
      const newIndex = finalOrder.indexOf(columnId);
      const oldIndex = storeColumnOrder.indexOf(columnId);

      if (newIndex === -1 || oldIndex === newIndex) {
        resetColumnOverride();
        return;
      }

      const afterId = newIndex > 0 ? finalOrder[newIndex - 1] : null;

      reorderColumnMutation.mutate(
        { columnId, afterId },
        { onSettled: resetColumnOverride },
      );
    },
    [storeColumnOrder, reorderColumnMutation, resetColumnOverride],
  );

  const handleCardDragEnd = useCallback(
    (event: DragEndParam) => {
      const currentDragItems = cardOverrideRef.current ?? storeCardItems;
      const newItems = move(currentDragItems, event);
      cardOverrideRef.current = newItems;
      setCardOverride(newItems);

      const source = event.operation?.source;
      if (!source) {
        resetCardOverride();
        return;
      }

      const cardId = String(source.id);

      // Find source column (pre-drag)
      let sourceColumnId = '';
      for (const [colId, cardIds] of Object.entries(storeCardItems)) {
        if (cardIds.includes(cardId)) {
          sourceColumnId = colId;
          break;
        }
      }

      // Find target column and index (post-drag)
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
        resetCardOverride();
        return;
      }

      // Nothing changed?
      if (sourceColumnId === targetColumnId) {
        const oldIndex = storeCardItems[sourceColumnId]?.indexOf(cardId) ?? -1;
        if (oldIndex === targetIndex) {
          resetCardOverride();
          return;
        }
      }

      const afterCardId =
        targetIndex > 0 ? newItems[targetColumnId][targetIndex - 1] : null;

      moveCardMutation.mutate(
        {
          sourceColumnId,
          cardId,
          newColumnId: targetColumnId,
          afterCardId,
        },
        { onSettled: resetCardOverride },
      );
    },
    [storeCardItems, moveCardMutation, resetCardOverride],
  );

  const handleDragEnd = useCallback(
    (event: DragEndParam) => {
      const currentDragType = dragTypeRef.current;
      dragTypeRef.current = null;

      if (event.canceled) {
        resetAll();
        return;
      }

      if (currentDragType === 'column') {
        handleColumnDragEnd(event);
      } else {
        handleCardDragEnd(event);
      }
    },
    [resetAll, handleColumnDragEnd, handleCardDragEnd],
  );

  return {
    cardItems,
    columnOrder,
    cardsMap,
    columnsMap,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
