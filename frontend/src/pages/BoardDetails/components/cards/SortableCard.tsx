import { useSortable } from '@dnd-kit/react/sortable';

import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

import { SEARCH_PARAMS } from '@/config/searchParams';

import { useIsBoardLoading } from '@/stores/board.store';
import useSearchParams from '@/hooks/useSearchParams';

import type { Card } from '@/types/board.types';

import { Badge } from '@/components/ui/badge';

import UserAvatar from '@/components/common/UserAvatar';

import ColumnCardDropdown from './ColumnCardDropdown';
import ColumnCardDetailsDialog from './ColumnCardDetailsDialog';

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

  const { setSearchParam, removeSearchParam, getSearchParam } =
    useSearchParams();
  const isLoading = useIsBoardLoading();
  const cardIdParam = getSearchParam(SEARCH_PARAMS.CARD_ID);

  const isCardDetailsOpen = !isLoading && cardIdParam === card.id;
  return (
    <>
      <div
        ref={ref}
        className={cn(
          'bg-muted group hover:bg-muted/80 flex cursor-pointer flex-col gap-1 rounded-md border p-2 transition-opacity',
          isDragSource && 'opacity-50',
        )}
        onClick={() => {
          setSearchParam(SEARCH_PARAMS.CARD_ID, card.id, { replace: true });
        }}
      >
        <div className="flex justify-between gap-2">
          <span className="underline-offset-4 group-hover:underline">
            {card.title}
          </span>
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

          {card.assignedTo && (
            <UserAvatar
              user={card.assignedTo}
              className="ml-auto"
              showTooltip
              link
            />
          )}
        </div>
      </div>

      <ColumnCardDetailsDialog
        isOpen={isCardDetailsOpen}
        open={(value) => {
          if (!value) removeSearchParam(SEARCH_PARAMS.CARD_ID);
        }}
        card={card}
      />
    </>
  );
};

export default SortableCard;
