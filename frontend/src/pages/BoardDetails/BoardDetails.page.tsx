import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditUser02Icon } from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';

import { type Board } from '@/types/board.types';

import { Skeleton } from '@/components/ui/skeleton';
import H3 from '@/components/ui/typography/H3';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Header from '@/components/common/Header';
import BoardRoleBadge from '@/components/board/BoardRoleBadge';
import BoardMembersAvatars from '@/components/board/BoardMembersAvatars';
import BoardMembersDrawer from './components/BoardMembersDrawer';

const BoardDetailsPage = () => {
  const { boardId } = useParams<{ boardId: string }>();

  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<Board>({
    queryKey: [API_ENDPOINTS.BOARD(boardId || '')],
  });

  return (
    <>
      <Header showBackButton>
        <div className="flex w-full justify-between gap-2">
          <div className="flex items-center gap-2">
            <H3>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : isError ? (
                'Board Not Found'
              ) : (
                data?.title
              )}
            </H3>

            {data && <BoardRoleBadge role={data.role} />}
          </div>

          <div className="flex items-center gap-2">
            <BoardMembersAvatars members={data?.members} />
            <Tooltip delay={300}>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsMembersDrawerOpen(true)}
                  >
                    <HugeiconsIcon icon={EditUser02Icon} />
                  </Button>
                }
              />
              <TooltipContent>Manage members</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Header>

      <BoardMembersDrawer
        isOpen={isMembersDrawerOpen}
        onOpenChange={setIsMembersDrawerOpen}
      />
    </>
  );
};

export default BoardDetailsPage;
