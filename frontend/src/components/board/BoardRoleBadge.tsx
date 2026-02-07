import type { BoardRole } from '@/types/board.types';

import { Badge } from '@/components/ui/badge';

type BoardRoleBadgeProps = {
  role: BoardRole;
};

const BoardRoleBadge = ({ role }: BoardRoleBadgeProps) => {
  const isAdminRole = role === 'ADMIN';

  return (
    <Badge variant={`${isAdminRole ? 'default' : 'secondary'}`}>
      {isAdminRole ? 'Admin' : 'Member'}
    </Badge>
  );
};

export default BoardRoleBadge;
