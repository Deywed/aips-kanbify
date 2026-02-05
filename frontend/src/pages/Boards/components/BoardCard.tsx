import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Board } from '@/types/board.types';

type Props = {
  board: Board;
};

const BoardCard = ({ board }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-2">
            <Badge
              variant={`${board.role === 'ADMIN' ? 'default' : 'secondary'}`}
            >
              {board.role === 'ADMIN' ? 'Admin' : 'Member'}
            </Badge>
            <span>{board.title}</span>
          </div>
        </CardTitle>
        {board.description && (
          <CardDescription>{board.description}</CardDescription>
        )}
      </CardHeader>
    </Card>
  );
};

export default BoardCard;
