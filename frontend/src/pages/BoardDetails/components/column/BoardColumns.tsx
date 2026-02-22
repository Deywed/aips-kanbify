import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import { useBoardColumns, useIsBoardLoading } from '@/stores/board.store';

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

const BoardColumns = ({ isError }: BoardColumnsProps) => {
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);

  const boardColumns = useBoardColumns();
  const isBoardLoading = useIsBoardLoading();

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
        <ScrollArea className="h-full w-full pb-4">
          <div className="inline-flex gap-4 pb-2" tabIndex={-1}>
            {boardColumns.map((column) => (
              <div
                className="bg-card flex h-full w-xs flex-col gap-4 rounded-md border p-2 shadow"
                key={column.id}
              >
                <div className="flex items-center justify-between gap-2 p-2">
                  <div className="flex items-center gap-2">
                    <H4>{column.title}</H4>
                    <Badge variant="secondary">{column.cards.length}</Badge>
                  </div>
                  <BoardAdminGuard>
                    <BoardColumnDropdown column={column} />
                  </BoardAdminGuard>
                </div>

                <ColumnCards columnId={column.id} cards={column.cards} />
              </div>
            ))}

            <div
              className="text-muted-foreground hover:bg-card/50 hover:text-foreground flex h-30 w-xs cursor-pointer items-center justify-center gap-2 rounded-md border shadow transition-colors hover:border-solid dark:border-dashed"
              onClick={() => setIsAddColumnOpen(true)}
            >
              <HugeiconsIcon icon={Add01Icon} size={16} /> Add column
            </div>
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </BlockUI>

      <BoardColumnDialog isOpen={isAddColumnOpen} open={setIsAddColumnOpen} />
    </>
  );
};

export default BoardColumns;
