import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { useDroppable } from '@dnd-kit/react';

import type { Card } from '@/types/board.types';

import { Button } from '@/components/ui/button';

import SortableCard from './SortableCard';
import ColumnCardDialog from './ColumnCardDialog';

type ColumnCardsProps = {
  columnId: string;
  cards: Card[];
};

const ColumnCards = ({ columnId, cards }: ColumnCardsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { ref: droppableRef } = useDroppable({
    id: columnId,
    type: 'column',
    accept: ['card'],
  });

  return (
    <>
      <div ref={droppableRef} className="flex min-h-12 flex-col gap-2">
        {cards.map((card, index) => (
          <SortableCard
            key={card.id}
            card={card}
            columnId={columnId}
            index={index}
          />
        ))}

        <Button
          variant="ghost"
          className="mt-auto"
          onClick={() => setIsDialogOpen(true)}
        >
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
