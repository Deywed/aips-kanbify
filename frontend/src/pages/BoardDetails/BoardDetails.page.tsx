import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { EditUser02Icon } from '@hugeicons/core-free-icons';

import {
  useBoardActions,
  useBoardInfo,
  useBoardMembers,
  useUserBoardRole,
} from '@/stores/board.store';

import { API_ENDPOINTS } from '@/config/endpoints';

import { useBoardSocket } from '@/hooks/board/useBoardSocket';

import { type BoardDetails } from '@/types/board.types';

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
import { BoardAdminGuard } from '@/components/guards/BoardAdminGuard';

import BoardMembersDrawer from './components/BoardMembersDrawer';
import BoardColumns from './components/column/BoardColumns';
import BoardFilters from './components/board-filters/BoardFilters';

const BoardDetailsPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);

  const queryClient = useQueryClient();

  // Zustand hooks
  const { setBoard, setLoading, resetBoard } = useBoardActions();
  const boardInfo = useBoardInfo();
  const members = useBoardMembers();
  const currentUserRole = useUserBoardRole();

  const { data, isLoading, isError, isSuccess } = useQuery<BoardDetails>({
    queryKey: [API_ENDPOINTS.BOARD(boardId || '')],
    enabled: !!boardId,
  });

  useBoardSocket(boardId); // Initialize board websocket connection

  // Sync loading state with React Query
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Initialize zustand store
  useEffect(() => {
    if (isSuccess && data) {
      setBoard(data);
    }
  }, [data, isSuccess, setBoard]);

  useEffect(() => {
    return () => {
      resetBoard();
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BOARD(boardId || '')],
      });
    };
  }, [boardId, queryClient, resetBoard]);

  return (
    <>
      <Header>
        <div className="flex w-full justify-between gap-2">
          <div className="flex items-center gap-2">
            <H3>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-5.5 w-16 rounded-2xl" />
                </div>
              ) : isError ? (
                'Error loading board'
              ) : (
                boardInfo.title
              )}
            </H3>

            {currentUserRole && <BoardRoleBadge role={currentUserRole} />}
          </div>

          <div className="flex items-center gap-2">
            <BoardMembersAvatars members={members} />

            <BoardAdminGuard>
              <Tooltip delay={300}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      onClick={() => setIsMembersDrawerOpen(true)}
                    >
                      <HugeiconsIcon icon={EditUser02Icon} />
                      Manage
                    </Button>
                  }
                />
                <TooltipContent>Manage members of this board</TooltipContent>
              </Tooltip>
            </BoardAdminGuard>
          </div>
        </div>
      </Header>

      <div className="flex h-full min-w-0 flex-col gap-4 overflow-hidden p-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-53" />
            <Skeleton className="h-9 w-18" />
          </div>
        ) : (
          <BoardFilters />
        )}
        <BoardColumns isError={isError} />
      </div>

      <BoardMembersDrawer
        isOpen={isMembersDrawerOpen}
        onOpenChange={setIsMembersDrawerOpen}
      />
    </>
  );
};

export default BoardDetailsPage;
