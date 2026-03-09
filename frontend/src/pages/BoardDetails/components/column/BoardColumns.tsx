import { useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { DragDropProvider } from '@dnd-kit/react';

import type { Card } from '@/types/board.types';

import { SEARCH_PARAMS } from '@/config/searchParams';
import useSearchParams from '@/hooks/useSearchParams';

import { useBoardColumns, useIsBoardLoading } from '@/stores/board.store';

import { useBoardDragDrop } from '@/hooks/board/useBoardDragDrop';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

import BlockUI from '@/components/common/BlockUI';

import BoardColumnDialog from './BoardColumnDialog';
import SortableColumn from './SortableColumn';
import ColumnCards from '../cards/ColumnCards';

type BoardColumnsProps = {
  isError?: boolean;
};

const BoardColumns = ({ isError }: BoardColumnsProps) => {
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const boardColumns = useBoardColumns();
  const isBoardLoading = useIsBoardLoading();
  const { getSearchParam } = useSearchParams();

  const searchQuery = getSearchParam(SEARCH_PARAMS.QUERY)?.toLowerCase() ?? '';
  const filterUserId = getSearchParam(SEARCH_PARAMS.USER_ID);

  const {
    cardItems,
    columnOrder,
    cardsMap,
    columnsMap,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragDrop(boardColumns);

  const hasFilters = searchQuery !== '' || !!filterUserId;

  const filteredCardsMap = useMemo(() => {
    if (!hasFilters) return null;

    const matchesCard = (card: Card) => {
      if (filterUserId && card.assignedTo?.id !== filterUserId) return false;
      if (searchQuery) {
        const inTitle = card.title.toLowerCase().includes(searchQuery);
        const inDesc = card.description?.toLowerCase().includes(searchQuery);
        const inTag = card.tags.some((t) =>
          t.name.toLowerCase().includes(searchQuery),
        );
        if (!inTitle && !inDesc && !inTag) return false;
      }
      return true;
    };

    const map = new Map<string, boolean>();
    for (const [, card] of cardsMap) {
      map.set(card.id, matchesCard(card));
    }
    return map;
  }, [hasFilters, filterUserId, searchQuery, cardsMap]);

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
          <ScrollArea className="-mr-4 size-full">
            <div className="mr-4 inline-flex gap-4 pb-4" tabIndex={-1}>
              {columnOrder.map((colId, colIndex) => {
                const column = columnsMap.get(colId);
                if (!column) return null;

                const orderedCards = (cardItems[column.id] ?? [])
                  .map((cardId) => cardsMap.get(cardId))
                  .filter(Boolean) as Card[];

                const visibleCards = filteredCardsMap
                  ? orderedCards.filter(
                      (card) => filteredCardsMap.get(card.id) ?? false,
                    )
                  : orderedCards;

                return (
                  <SortableColumn
                    key={column.id}
                    column={column}
                    cardCount={visibleCards.length}
                    index={colIndex}
                  >
                    <ColumnCards columnId={column.id} cards={visibleCards} />
                  </SortableColumn>
                );
              })}

              <Button
                variant="outline"
                onClick={() => setIsAddColumnOpen(true)}
              >
                <HugeiconsIcon icon={Add01Icon} /> Add column
              </Button>
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
