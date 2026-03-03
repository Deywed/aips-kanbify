import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn, getUserFullName } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import type { User } from '@/types/auth.types';

import UserAvatar from './UserAvatar';

type UserDisplayProps = {
  user: User;
  link?: boolean;
  className?: string;
};

const UserDisplay = ({ user, link, className }: UserDisplayProps) => {
  const content = useMemo(
    () => (
      <>
        <UserAvatar user={user} link />
        <div className="flex flex-col text-sm">
          <span className="underline-offset-4 group-hover:underline">
            {getUserFullName(user)}
          </span>
          <span className="text-muted-foreground">@{user.username}</span>
        </div>
      </>
    ),
    [user],
  );

  if (link) {
    return (
      <Link
        to={APP_ROUTES.USER_DETAILS(user.id)}
        className={cn('group flex w-full gap-2', className)}
      >
        {content}
      </Link>
    );
  }

  return <div className={cn('flex w-full gap-2', className)}>{content}</div>;
};

export default UserDisplay;
