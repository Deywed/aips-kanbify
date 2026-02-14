import SearchInput from '@/components/common/SearchInput';

import TagsDialog from './TagsDialog';

const BoardFilters = () => {
  return (
    <div className="flex items-center gap-2">
      <SearchInput className="w-fit" />
      <TagsDialog />
    </div>
  );
};

export default BoardFilters;
