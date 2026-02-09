import { useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';

import { navigateTo } from '@/lib/navigation';
import { cn, getAvatarFallback, getUserFullName } from '@/lib/utils';

import type { BoardMember } from '@/types/auth.types';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

type UserAvatarProps = {
  user: BoardMember;
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
        {user.role && user.role === 'ADMIN' && (
          <AvatarBadge className="left-0 ring-1">
            <HugeiconsIcon icon={StarIcon} />
          </AvatarBadge>
        )}
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
