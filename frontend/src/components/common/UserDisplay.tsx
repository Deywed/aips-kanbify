import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getUserFullName } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import type { User } from '@/types/auth.types';

import UserAvatar from './UserAvatar';

type UserDisplayProps = {
  user: User;
  link?: boolean;
};

const UserDisplay = ({ user, link }: UserDisplayProps) => {
  const content = useMemo(
    () => (
      <>
        <UserAvatar user={user} />
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
        className="group flex w-full gap-2"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex w-full gap-2">{content}</div>;
};

export default UserDisplay;
