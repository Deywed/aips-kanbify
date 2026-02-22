import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import { formatDate } from '@/lib/utils';

import type { Card } from '@/types/board.types';

import { Button } from '@/components/ui/button';

import UserAvatar from '@/components/common/UserAvatar';

import ColumnCardDialog from './ColumnCardDialog';
import ColumnCardDropdown from './ColumnCardDropdown';
import { Badge } from '@/components/ui/badge';

type ColumnCardsProps = {
  columnId: string;
  cards: Card[];
};

const ColumnCards = ({ columnId, cards }: ColumnCardsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-muted flex flex-col gap-1 rounded-md border p-2"
          >
            <div className="flex justify-between gap-2">
              <span>{card.title}</span>
              <ColumnCardDropdown columnId={columnId} card={card} />
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
                <UserAvatar user={card.assignedTo} showTooltip />
              )}
            </div>
          </div>
        ))}

        <Button variant="ghost" onClick={() => setIsDialogOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} size={16} /> Add card
        </Button>
      </div>

      <ColumnCardDialog
        isOpen={isDialogOpen}
        open={setIsDialogOpen}
        columnId={columnId}
      />
    </>
  );
};

export default ColumnCards;
