import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import { API_ENDPOINTS } from '@/config/endpoints';

import { type Board } from '@/types/board.types';

import H3 from '@/components/ui/typography/H2';
import { Button } from '@/components/ui/button';

import Header from '@/components/common/Header';

import BlockUI from '@/components/common/BlockUI';
import BoardCard from './components/BoardCard';
import BoardDialog from './components/BoardDialog';

const BoardsPage = () => {
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<Board[]>({
    queryKey: [API_ENDPOINTS.BOARDS],
  });

  const isEmpty = !isLoading && !isError && (data?.length ?? 0) === 0;

  return (
    <>
      <Header className="flex justify-between gap-4">
        <H3>My Boards</H3>
        <Button onClick={() => setIsBoardDialogOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} /> New Board
        </Button>
      </Header>

      <div className="size-full p-4">
        <BlockUI isLoading={isLoading} isError={isError} isEmpty={isEmpty}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </BlockUI>
      </div>

      <BoardDialog isOpen={isBoardDialogOpen} open={setIsBoardDialogOpen} />
    </>
  );
};

export default BoardsPage;
