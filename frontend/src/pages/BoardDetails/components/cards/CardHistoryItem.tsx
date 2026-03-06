import { formatDate, formatRelativeDate, getUserFullName } from '@/lib/utils';
import { APP_ROUTES } from '@/config/appRoutes';

import type {
  CardHistoryEntry,
  UpdatedPayload,
  MovedPayload,
  AssignedPayload,
} from '@/types/card-history.types';

import UserAvatar from '@/components/common/UserAvatar';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

type CardHistoryItemProps = {
  entry: CardHistoryEntry;
};

const CardHistoryItem = ({ entry }: CardHistoryItemProps) => {
  const renderAction = () => {
    switch (entry.action) {
      case 'UPDATED': {
        const payload = entry.payload as UpdatedPayload;

        if (payload.field === 'title') {
          return (
            <span>
              Updated title from{' '}
              <span className="font-bold">{payload.oldValue}</span> to{' '}
              <span className="font-bold">{payload.newValue}</span>
            </span>
          );
        }
        if (payload.field === 'description') {
          return (
            <span>
              Updated description from{' '}
              <span className="font-bold">
                {payload.oldValue
                  ? payload.oldValue.substring(0, 30) + '...'
                  : 'empty'}
              </span>{' '}
              to{' '}
              <span className="font-bold">
                {payload.newValue
                  ? payload.newValue.substring(0, 30) + '...'
                  : 'empty'}
              </span>
            </span>
          );
        }
        if (payload.field === 'dueDate') {
          return (
            <span>
              Updated due date from{' '}
              <span className="font-bold">
                {payload.oldValue ? formatDate(payload.oldValue) : 'empty'}
              </span>{' '}
              to{' '}
              <span className="font-bold">
                {payload.newValue ? formatDate(payload.newValue) : 'empty'}
              </span>
            </span>
          );
        }

        break;
      }
      case 'MOVED': {
        const payload = entry.payload as MovedPayload;

        return (
          <span>
            Moved from{' '}
            <span className="font-bold">{payload.fromColumnName}</span> to{' '}
            <span className="font-bold">{payload.toColumnName}</span>
          </span>
        );
      }
      case 'ASSIGNED': {
        const payload = entry.payload as AssignedPayload;

        if (payload.newAssigneeName && !payload.oldAssigneeName) {
          return (
            <span>
              Assigned to{' '}
              <UserFullNameLink
                name={payload.newAssigneeName}
                id={payload.newAssigneeId!}
              />
            </span>
          );
        }

        if (!payload.newAssigneeName && payload.oldAssigneeName) {
          return (
            <span>
              Unassigned from{' '}
              <UserFullNameLink
                name={payload.oldAssigneeName}
                id={payload.oldAssigneeId!}
              />
            </span>
          );
        }

        if (payload.newAssigneeName && payload.oldAssigneeName) {
          return (
            <span>
              Reassigned from{' '}
              <UserFullNameLink
                name={payload.oldAssigneeName}
                id={payload.oldAssigneeId!}
              />{' '}
              to{' '}
              <UserFullNameLink
                name={payload.newAssigneeName}
                id={payload.newAssigneeId!}
              />
            </span>
          );
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 border-b pb-4">
      <div className="flex items-center gap-2">
        <UserAvatar user={entry.actor} size={6} />
        <span>{getUserFullName(entry.actor)}</span>
        <Separator orientation="vertical" />
        <span className="text-muted-foreground">
          {formatRelativeDate(entry.createdAt)}
        </span>
      </div>

      <div className="ml-8">{renderAction()}</div>
    </div>
  );
};

const UserFullNameLink = ({ name, id }: { name: string; id: string }) => {
  return (
    <Link
      to={APP_ROUTES.USER_DETAILS(id)}
      className="text-primary font-bold underline-offset-4 hover:underline"
    >
      {name}
    </Link>
  );
};

export default CardHistoryItem;
