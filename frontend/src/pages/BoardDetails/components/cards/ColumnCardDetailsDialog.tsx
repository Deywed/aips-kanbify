import type { Dispatch, SetStateAction } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

import { formatDate } from '@/lib/utils';

import { SEARCH_PARAMS } from '@/config/searchParams';

import type { Card } from '@/types/board.types';
import type { CardHistoryEntry } from '@/types/card-history.types';

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
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/config/endpoints';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

import BlockUI from '@/components/common/BlockUI';

import CardHistoryItem from './CardHistoryItem';

type Props = {
  isOpen: boolean;
  open: Dispatch<SetStateAction<boolean>>;
  card: Card;
};

const ColumnCardDetailsDialog = ({ isOpen, open, card }: Props) => {
  const { removeSearchParam } = useSearchParams();

  const { data, isLoading } = useQuery<CardHistoryEntry[]>({
    queryKey: [API_ENDPOINTS.GET_CARD_HISTORY(card.id)],
    enabled: isOpen,
    staleTime: 0,
  });

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

            <Collapsible className="rounded-md border p-4">
              <CollapsibleTrigger
                render={
                  <Button variant="ghost" className="w-full">
                    Card history
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      className="ml-auto group-data-panel-open/button:rotate-180"
                    />
                  </Button>
                }
              />
              <CollapsibleContent className="px-2 pt-4">
                <BlockUI
                  isLoading={isLoading}
                  isEmpty={!data || data.length === 0}
                  className="flex flex-col gap-4"
                >
                  {data?.map((entry) => (
                    <CardHistoryItem key={entry.id} entry={entry} />
                  ))}
                </BlockUI>
              </CollapsibleContent>
            </Collapsible>

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
