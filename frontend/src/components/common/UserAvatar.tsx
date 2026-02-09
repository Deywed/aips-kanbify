import { useMemo } from 'react';
import { navigateTo } from '@/lib/navigation';
import { cn, getAvatarFallback, getUserFullName } from '@/lib/utils';

import type { User } from '@/types/auth.types';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = {
  user: User;
  size?: number;
  className?: string;
  showTooltip?: boolean;
};

const UserAvatar = ({
  user,
  size = 9,
  className,
  showTooltip = false,
}: UserAvatarProps) => {
  const avatar = useMemo(
    () => (
      <Avatar
        className={cn(
          'relative shrink-0 cursor-pointer',
          `size-${size}`,
          className,
        )}
        onClick={(e) => {
          e.stopPropagation();
          navigateTo(`/users/${user.id}`);
        }}
      >
        <AvatarImage
          src={user.avatarUrl}
          alt={`${getUserFullName(user)} avatar`}
        />
        <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
      </Avatar>
    ),
    [size, className, user],
  );

  if (!showTooltip) {
    return avatar;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={avatar} />
      <TooltipContent>
        <span>@{user.username}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default UserAvatar;
