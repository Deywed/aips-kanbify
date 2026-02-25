import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';

import { cn } from '@/lib/utils';

import type { Column } from '@/types/board.types';

import { Badge } from '@/components/ui/badge';

import H4 from '@/components/ui/typography/H4';

import { BoardAdminGuard } from '@/components/guards/BoardAdminGuard';

import BoardColumnDropdown from './BoardColumnDropdown';

type SortableColumnProps = {
  column: Column;
  cardCount: number;
  index: number;
  children: ReactNode;
};

const SortableColumn = ({
  column,
  cardCount,
  index,
  children,
}: SortableColumnProps) => {
  const { ref, handleRef, isDragSource } = useSortable({
    id: column.id,
    index,
    type: 'column',
  });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-card flex h-full w-xs flex-col gap-4 rounded-md border p-2 shadow',
        isDragSource && 'opacity-50',
      )}
    >
      <div className="flex cursor-grab items-center justify-between gap-2 p-2 active:cursor-grabbing">
        <div className="flex flex-1 items-center gap-2" ref={handleRef}>
          <H4>{column.title}</H4>
          <Badge variant="secondary">{cardCount}</Badge>
        </div>
        <BoardAdminGuard>
          <BoardColumnDropdown column={column} />
        </BoardAdminGuard>
      </div>

      {children}
    </div>
  );
};

export default SortableColumn;
