import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import { formatDate } from '@/lib/utils';

import type { Card } from '@/types/board.types';

import { Button } from '@/components/ui/button';

import UserAvatar from '@/components/common/UserAvatar';

type ColumnCardsProps = {
  columnId: string;
  cards: Card[];
};

const ColumnCards = ({ columnId, cards }: ColumnCardsProps) => {
  return (
    <div className="flex flex-col gap-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-muted flex flex-col gap-2 rounded-md border p-2"
        >
          <span>{card.title}</span>

          <div className="flex items-end justify-between gap-2">
            {card.dueDate && (
              <span className="text-muted-foreground text-sm">
                {formatDate(card.dueDate)}
              </span>
            )}

            {card.assignedTo && (
              <UserAvatar user={card.assignedTo} showTooltip />
            )}
          </div>
        </div>
      ))}

      <Button variant="ghost" className="">
        <HugeiconsIcon icon={Add01Icon} size={16} /> Add card
      </Button>
    </div>
  );
};

export default ColumnCards;
