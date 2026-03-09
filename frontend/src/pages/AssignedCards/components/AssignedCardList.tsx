import type { CardWithBoard } from '@/types/board.types';

import { Card } from '@/components/ui/card';

import AssignedCardItem from './AssignedCardItem';

type AssignedCardListProps = {
  cards: CardWithBoard[];
};

const AssignedCardList = ({ cards }: AssignedCardListProps) => {
  return (
    <Card className="mx-auto w-full max-w-3xl gap-0 py-0">
      <div className="flex flex-col">
        {cards.map((card, index) => (
          <AssignedCardItem
            key={card.id}
            card={card}
            isLast={index === cards.length - 1}
          />
        ))}
      </div>
    </Card>
  );
};

export default AssignedCardList;
