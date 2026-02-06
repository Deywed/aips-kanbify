import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
          navigate(`/users/${user.id}`);
        }}
      >
        <AvatarImage
          src={user.avatarUrl}
          alt={`${getUserFullName(user)} avatar`}
        />
        <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
      </Avatar>
    ),
    [size, className, user, navigate],
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
