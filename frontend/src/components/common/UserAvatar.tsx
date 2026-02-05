import { cn, getAvatarFallback, getUserFullName } from '@/lib/utils';

import type { User } from '@/types/auth.types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = {
  user: User;
  className?: string;
};

const UserAvatar = ({ user, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn('relative size-9 shrink-0', className)}>
      <AvatarImage
        src={user.avatarUrl}
        alt={`${getUserFullName(user)} avatar`}
      />
      <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
