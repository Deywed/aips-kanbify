import { useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';

import { type Board } from '@/types/board.types';

import H3 from '@/components/ui/typography/H2';

import Header from '@/components/common/Header';
import BlockUI from '@/components/common/BlockUI';
import BoardCard from './components/BoardCard';
import NewBoardDialog from './components/NewBoardDialog';

const BoardsPage = () => {
  const { data, isLoading, isError } = useQuery<Board[]>({
    queryKey: [API_ENDPOINTS.BOARDS],
  });

  const isEmpty = !isLoading && !isError && (data?.length ?? 0) === 0;

  return (
    <>
      <Header className="flex justify-between gap-4">
        <H3>My Boards</H3>
        <NewBoardDialog />
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
    </>
  );
};

export default BoardsPage;
