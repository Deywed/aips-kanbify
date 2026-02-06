import { useNavigate } from 'react-router-dom';

import type { Board } from '@/types/board.types';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import UserAvatar from '@/components/common/UserAvatar';

type BoardCardProps = {
  board: Board;
};

const BoardCard = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();

  const isAdminRole = board.role === 'ADMIN';

  return (
    <Card
      className="hover:bg-muted/40 cursor-pointer gap-4 transition-colors"
      onClick={() => navigate(`/boards/${board.id}`)}
    >
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-2">
            <Badge variant={`${isAdminRole ? 'default' : 'secondary'}`}>
              {isAdminRole ? 'Admin' : 'Member'}
            </Badge>
            <span>{board.title}</span>
          </div>
        </CardTitle>
        {board.description && (
          <CardDescription>{board.description}</CardDescription>
        )}
      </CardHeader>

      <CardFooter className="mt-auto ml-auto">
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-9 *:data-[slot=avatar]:ring-2">
          {board.members &&
            board.members.map((member) => (
              <UserAvatar key={member.id} user={member} showTooltip />
            ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BoardCard;
