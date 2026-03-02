import type { BoardMember } from '@/types/auth.types';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import UserAvatar from '@/components/common/UserAvatar';
import UserDisplay from '@/components/common/UserDisplay';

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
            <UserAvatar key={member.id} user={member} showTooltip link />
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
              <UserDisplay key={member.id} user={member} link />
            ))}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

export default BoardMembersAvatars;
