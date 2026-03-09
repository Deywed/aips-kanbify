import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

import { formatDate, formatRelativeDate } from '@/lib/utils';
import { navigateTo } from '@/lib/navigation';

import { APP_ROUTES } from '@/config/appRoutes';

import type { CardWithBoard } from '@/types/board.types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import UserAvatar from '@/components/common/UserAvatar';

type AssignedCardItemProps = {
  card: CardWithBoard;
  isLast: boolean;
};

const AssignedCardItem = ({ card, isLast }: AssignedCardItemProps) => {
  return (
    <>
      <Link
        to={APP_ROUTES.CARD_DETAILS(card.board.id, card.id)}
        className="hover:bg-muted/50 group flex cursor-pointer gap-4 p-4 transition-colors"
      >
        {/* Created by avatar */}
        <UserAvatar user={card.createdBy} link />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {/* Header: board name + timestamp */}
          <div className="flex items-center gap-2">
            <Badge
              onClick={(e) => {
                e.stopPropagation();
                navigateTo(APP_ROUTES.BOARD_DETAILS(card.board.id));
              }}
            >
              {card.board.title}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {formatRelativeDate(card.createdAt)}
            </span>

            <Button
              variant="ghost"
              size="sm"
              className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            >
              Open
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
            </Button>
          </div>

          {/* Card title */}
          <span className="text-sm font-medium group-hover:underline group-hover:underline-offset-4">
            {card.title}
          </span>

          {/* Description preview */}
          {card.description && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {card.description}
            </p>
          )}

          {/* Footer: tags + due date */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {card.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}

            {card.dueDate && (
              <span className="text-muted-foreground ml-auto text-xs">
                Due {formatDate(card.dueDate)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {!isLast && <Separator />}
    </>
  );
};

export default AssignedCardItem;
