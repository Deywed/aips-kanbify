import type { Dispatch, SetStateAction } from 'react';

import { formatDate } from '@/lib/utils';

import { SEARCH_PARAMS } from '@/config/searchParams';

import type { Card } from '@/types/board.types';

import useSearchParams from '@/hooks/useSearchParams';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import UserDisplay from '@/components/common/UserDisplay';
import { Badge } from '@/components/ui/badge';

type Props = {
  isOpen: boolean;
  open: Dispatch<SetStateAction<boolean>>;
  card: Card;
};

const ColumnCardDetailsDialog = ({ isOpen, open, card }: Props) => {
  const { removeSearchParam } = useSearchParams();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        removeSearchParam(SEARCH_PARAMS.CARD_ID);
        open(false);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {card.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="-mx-6 max-h-[70vh]">
          <div className="mx-6 flex flex-col gap-6">
            <DialogDescription className="text-base whitespace-pre-wrap">
              {card.description || 'No description provided.'}
            </DialogDescription>

            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <Badge key={tag.id}>{tag.name}</Badge>
                ))}
              </div>
            )}

            <div className="flex flex-col items-start gap-4 md:flex-row">
              <div className="flex w-full flex-1 flex-col gap-2">
                <span className="text-muted-foreground text-sm">
                  Created by
                </span>
                <UserDisplay
                  user={card.createdBy}
                  className="rounded-md border p-4"
                  link
                />
              </div>
              <div className="flex h-full w-full flex-1 flex-col gap-2">
                <span className="text-muted-foreground text-sm">
                  Assigned to
                </span>
                {card.assignedTo ? (
                  <UserDisplay
                    user={card.assignedTo}
                    className="rounded-md border p-4"
                    link
                  />
                ) : (
                  <div className="text-muted-foreground rounded-md border p-4">
                    No one is assigned to this card.
                  </div>
                )}
              </div>
            </div>

            <div className="text-muted-foreground rounded-md border p-4">
              Due:{' '}
              {card.dueDate ? (
                <span className="text-foreground">
                  {formatDate(card.dueDate)}
                </span>
              ) : (
                'No due date set'
              )}
            </div>

            <span className="text-muted-foreground ml-auto text-sm">
              Last updated at:{' '}
              <span className="text-foreground font-medium">
                {formatDate(card.updatedAt)}
              </span>
            </span>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnCardDetailsDialog;
