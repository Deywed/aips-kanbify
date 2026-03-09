import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/config/endpoints';
import { SEARCH_PARAMS } from '@/config/searchParams';

import useSearchParams from '@/hooks/useSearchParams';

import type { PaginationResponse } from '@/types/paginationResponse.types';
import type { CardWithBoard } from '@/types/board.types';

import H3 from '@/components/ui/typography/H3';
import Header from '@/components/common/Header';
import BlockUI from '@/components/common/BlockUI';
import PaginationBar from '@/components/common/PaginationBar';

import AssignedCardList from './components/AssignedCardList';

const AssignedCardsPage = () => {
  const { getSearchParam } = useSearchParams();

  const { data, isLoading, isError } = useQuery<
    PaginationResponse<CardWithBoard>
  >({
    queryKey: [
      API_ENDPOINTS.ASSIGNED_CARDS,
      {
        page: getSearchParam(SEARCH_PARAMS.PAGE) || '1',
      },
    ],
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <Header>
        <H3>Assigned Cards</H3>
      </Header>

      <BlockUI
        isLoading={isLoading}
        isError={isError}
        isEmpty={data?.items.length === 0}
        className="p-4"
      >
        <AssignedCardList cards={data?.items ?? []} />
      </BlockUI>

      {data && (
        <PaginationBar
          currentPage={data.page}
          pageSize={data.pageSize}
          totalItems={data.total}
          className="mt-auto p-4"
        />
      )}
    </>
  );
};

export default AssignedCardsPage;
