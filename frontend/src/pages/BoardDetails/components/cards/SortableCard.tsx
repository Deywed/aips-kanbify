import { useSortable } from '@dnd-kit/react/sortable';

import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

import type { Card } from '@/types/board.types';

import { Badge } from '@/components/ui/badge';

import UserAvatar from '@/components/common/UserAvatar';

import ColumnCardDropdown from './ColumnCardDropdown';

type SortableCardProps = {
  card: Card;
  columnId: string;
  index: number;
};

const SortableCard = ({ card, columnId, index }: SortableCardProps) => {
  const { ref, isDragSource } = useSortable({
    id: card.id,
    index,
    type: 'card',
    group: columnId,
    data: { columnId },
  });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-muted group hover:bg-muted/80 flex flex-col gap-1 rounded-md border p-2 transition-opacity',
        isDragSource && 'opacity-50',
      )}
    >
      <div className="flex justify-between gap-2">
        <span>{card.title}</span>
        <ColumnCardDropdown
          columnId={columnId}
          card={card}
          className="invisible group-hover:visible"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {card.tags.map((tag) => (
          <Badge key={tag.id}>{tag.name}</Badge>
        ))}
      </div>

      <div className="flex items-end justify-between gap-2">
        {card.dueDate && (
          <span className="text-muted-foreground text-sm">
            {formatDate(card.dueDate)}
          </span>
        )}

        {card.assignedTo && <UserAvatar user={card.assignedTo} showTooltip />}
      </div>
    </div>
  );
};

export default SortableCard;
