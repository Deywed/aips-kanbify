import { Link } from 'react-router-dom';

import type { Board } from '@/types/board.types';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import BoardRoleBadge from '@/components/board/BoardRoleBadge';

import BoardCardDropdown from './BoardCardDropdown';
import BoardMembersAvatars from '@/components/board/BoardMembersAvatars';

type BoardCardProps = {
  board: Board;
};

const BoardCard = ({ board }: BoardCardProps) => {
  return (
    <Card className="hover:bg-muted/40 gap-4 transition-colors">
      <CardHeader>
        <CardTitle className="flex">
          <Link
            to={`/boards/${board.id}`}
            className="group flex flex-1 flex-col gap-2"
          >
            <BoardRoleBadge role={board.role} />
            <span className="text-xl underline-offset-4 group-hover:underline">
              {board.title}
            </span>
          </Link>

          <BoardCardDropdown board={board} />
        </CardTitle>
        {board.description && (
          <CardDescription>{board.description}</CardDescription>
        )}
      </CardHeader>

      <CardFooter className="mt-auto ml-auto">
        <BoardMembersAvatars members={board.members} />
      </CardFooter>
    </Card>
  );
};

export default BoardCard;
