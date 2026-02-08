import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { getUserFullName } from '@/lib/utils';

import { useBoardInfo } from '@/stores/board.store';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import { useAddBoardMemberMutation } from '@/mutations/board-members/useAddBoardMemberMutation';

import LoadingButton from '@/components/ui/loading-button';

import SearchInput from '@/components/common/SearchInput';
import UserAvatar from '@/components/common/UserAvatar';
import BlockUI from '@/components/common/BlockUI';

const SearchMembers = () => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const boardInfo = useBoardInfo();

  const { data, isLoading, refetch } = useQuery<User[]>({
    queryKey: [
      API_ENDPOINTS.USERS_SEARCH,
      {
        query: debouncedQuery,
        excludeBoardId: boardInfo?.id,
      },
    ],
    enabled:
      debouncedQuery !== '' && debouncedQuery.length > 2 && !!boardInfo?.id,
  });

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        value={inputValue}
        onValueChange={setInputValue}
        onDebouncedChange={setDebouncedQuery}
        placeholder="Search users..."
        autoComplete="off"
      />

      <BlockUI
        isLoading={isLoading}
        isEmpty={data?.length === 0}
        className="flex flex-col gap-4"
      >
        {data?.map((user) => (
          <SearchMemberItem
            key={user.id}
            user={user}
            onAddedSuccess={refetch}
          />
        ))}
      </BlockUI>
    </div>
  );
};

type SearchMemberItemProps = {
  user: User;
  onAddedSuccess?: () => void;
};

const SearchMemberItem = ({ user, onAddedSuccess }: SearchMemberItemProps) => {
  const boardInfo = useBoardInfo();

  const { mutate, isPending } = useAddBoardMemberMutation(boardInfo.id || '');

  const handleAddMember = (userId: string) => {
    mutate(
      {
        userId,
        role: 'MEMBER',
      },
      {
        onSuccess: (data) => {
          toast.success(`${getUserFullName(data)} added to the board`);
          onAddedSuccess?.();
        },
      },
    );
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex gap-2">
        <UserAvatar user={user} />
        <div className="flex flex-col text-sm">
          <span>{getUserFullName(user)}</span>
          <span className="text-muted-foreground">@{user.username}</span>
        </div>
      </div>

      <LoadingButton
        size="sm"
        isLoading={isPending}
        onClick={() => handleAddMember(user.id)}
      >
        <HugeiconsIcon icon={Add01Icon} />
        Add
      </LoadingButton>
    </div>
  );
};

export default SearchMembers;
