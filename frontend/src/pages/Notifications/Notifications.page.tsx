import { useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { API_ENDPOINTS } from '@/config/endpoints';
import { SEARCH_PARAMS } from '@/config/searchParams';

import useSearchParams from '@/hooks/useSearchParams';

import { useNotificationsActions } from '@/stores/notifications.store';

import { useMarkAllAsReadMutation } from '@/mutations/notifications/useMarkAllAsReadMutation';

import type { PaginationResponse } from '@/types/paginationResponse.types';
import type { Notification } from '@/types/notification.types';

import H3 from '@/components/ui/typography/H3';
import Header from '@/components/common/Header';
import PaginationBar from '@/components/common/PaginationBar';
import BlockUI from '@/components/common/BlockUI';

import NotificationList from './components/NotificationList';

const NotificationsPage = () => {
  const { getSearchParam } = useSearchParams();
  const { resetUnread } = useNotificationsActions();
  const { mutate } = useMarkAllAsReadMutation();

  const { data, isLoading, isError } = useQuery<
    PaginationResponse<Notification>
  >({
    queryKey: [
      API_ENDPOINTS.NOTIFICATIONS,
      {
        page: getSearchParam(SEARCH_PARAMS.PAGE) || '1',
      },
    ],
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    toast.dismiss();
    resetUnread();
    mutate();
  }, [resetUnread, mutate]);

  return (
    <>
      <Header>
        <H3>Notifications</H3>
      </Header>

      <BlockUI
        isLoading={isLoading}
        isError={isError}
        isEmpty={data?.items.length === 0}
        className="p-4"
      >
        <NotificationList notifications={data?.items ?? []} />
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

export default NotificationsPage;
