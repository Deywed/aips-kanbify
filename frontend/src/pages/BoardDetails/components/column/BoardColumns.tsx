import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { DragDropProvider } from '@dnd-kit/react';

import type { Card } from '@/types/board.types';

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

  const {
    cardItems,
    columnOrder,
    cardsMap,
    columnsMap,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragDrop(boardColumns);

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
          <ScrollArea className="size-full">
            <div className="inline-flex gap-4 pb-2" tabIndex={-1}>
              {columnOrder.map((colId, colIndex) => {
                const column = columnsMap.get(colId);
                if (!column) return null;

                const orderedCards = (cardItems[column.id] ?? [])
                  .map((cardId) => cardsMap.get(cardId))
                  .filter(Boolean) as Card[];

                return (
                  <SortableColumn
                    key={column.id}
                    column={column}
                    cardCount={orderedCards.length}
                    index={colIndex}
                  >
                    <ColumnCards columnId={column.id} cards={orderedCards} />
                  </SortableColumn>
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
