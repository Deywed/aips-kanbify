import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';

import type { BoardRole } from '@/types/board.types';

import { Badge } from '@/components/ui/badge';

type BoardRoleBadgeProps = {
  role: BoardRole;
};

const BoardRoleBadge = ({ role }: BoardRoleBadgeProps) => {
  const isAdminRole = role === 'ADMIN';

  return (
    <Badge variant={`${isAdminRole ? 'default' : 'secondary'}`}>
      {isAdminRole && <HugeiconsIcon icon={StarIcon} />}
      {isAdminRole ? 'Admin' : 'Member'}
    </Badge>
  );
};

export default BoardRoleBadge;
