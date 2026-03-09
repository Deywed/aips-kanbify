import { useCallback } from 'react';
import { getUserFullName } from '@/lib/utils';

import { SEARCH_PARAMS } from '@/config/searchParams';
import useSearchParams from '@/hooks/useSearchParams';

import { useBoardMembers } from '@/stores/board.store';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SearchInput from '@/components/common/SearchInput';
import UserAvatar from '@/components/common/UserAvatar';

import TagsDialog from './TagsDialog';

const ALL_MEMBERS = 'All members';

const BoardFilters = () => {
  const boardMembers = useBoardMembers();
  const { getSearchParam, setSearchParam, removeSearchParam } =
    useSearchParams();

  const selectedMemberId = getSearchParam(SEARCH_PARAMS.USER_ID);
  const selectedMember = selectedMemberId
    ? boardMembers.find((m) => m.id === selectedMemberId)
    : undefined;

  const searchQuery = getSearchParam(SEARCH_PARAMS.QUERY) ?? '';

  const handleDebouncedChange = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        setSearchParam(SEARCH_PARAMS.QUERY, trimmed, { replace: true });
      } else {
        removeSearchParam(SEARCH_PARAMS.QUERY);
      }
    },
    [setSearchParam, removeSearchParam],
  );

  return (
    <div className="flex items-center gap-2">
      <SearchInput
        className="w-3xs"
        defaultValue={searchQuery}
        onDebouncedChange={handleDebouncedChange}
      />

      <Select
        value={selectedMemberId ?? ALL_MEMBERS}
        onValueChange={(value) => {
          if (!value || value === ALL_MEMBERS) {
            removeSearchParam(SEARCH_PARAMS.USER_ID);
          } else {
            setSearchParam(SEARCH_PARAMS.USER_ID, value, { replace: true });
          }
        }}
      >
        <SelectTrigger className="w-3xs">
          <SelectValue placeholder="Filter by member">
            {selectedMember ? (
              <div className="flex items-center gap-2">
                <UserAvatar user={selectedMember} size={6} />
                <span>{getUserFullName(selectedMember)}</span>
              </div>
            ) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectItem value={ALL_MEMBERS}>All members</SelectItem>
          <SelectSeparator />
          {boardMembers.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              <div className="flex items-center gap-2">
                <UserAvatar user={member} size={8} />
                <span>{getUserFullName(member)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TagsDialog />
    </div>
  );
};

export default BoardFilters;
