import { Link } from 'react-router-dom';
import { getUserFullName } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import type { BoardMember } from '@/types/auth.types';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import UserAvatar from '@/components/common/UserAvatar';

type BoardMembersAvatars = {
  members?: BoardMember[];
  maxVisible?: number;
};

const BoardMembersAvatars = ({
  members,
  maxVisible = 3,
}: BoardMembersAvatars) => {
  if (!members || members.length === 0) {
    return null;
  }

  const remainingCount = members ? members.length - maxVisible : 0;

  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-9 *:data-[slot=avatar]:ring-2">
      {members &&
        members
          .slice(0, maxVisible)
          .map((member) => (
            <UserAvatar key={member.id} user={member} showTooltip />
          ))}

      {remainingCount > 0 && (
        <HoverCard>
          <HoverCardTrigger>
            <Avatar className="size-9 cursor-pointer">
              <AvatarFallback>+{remainingCount}</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent align="end" className="flex flex-col gap-2">
            {members.slice(maxVisible).map((member) => (
              <Link
                to={APP_ROUTES.USER_DETAILS(member.id)}
                key={member.id}
                className="group flex gap-2"
              >
                <UserAvatar user={member} />
                <div className="flex flex-col text-sm">
                  <span className="underline-offset-4 group-hover:underline">
                    {getUserFullName(member)}
                  </span>
                  <span className="text-muted-foreground">
                    @{member.username}
                  </span>
                </div>
              </Link>
            ))}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

export default BoardMembersAvatars;
