import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronDoubleCloseIcon } from '@hugeicons/core-free-icons';

import { useAuthUser } from '@/stores/auth.store';
import { getAvatarFallback, getUserFullName } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

import LogoutDropdownItem from './LogoutDropdownItem';
import { ThemeDropdownMenuItem } from './ThemeToggle';

const CurrentUserAvatar = () => {
  const user = useAuthUser();
  const { isMobile } = useSidebar();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="relative size-8 shrink-0">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
              <span className="truncate font-semibold">
                {getUserFullName(user)}
              </span>
              <span className="text-muted-foreground truncate">{`@${user.username}`}</span>
            </div>

            <HugeiconsIcon
              icon={ChevronDoubleCloseIcon}
              className="shrink-0 rotate-90"
            />
          </SidebarMenuButton>
        }
      />

      <DropdownMenuContent
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <LogoutDropdownItem />
        <DropdownMenuSeparator />
        <ThemeDropdownMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrentUserAvatar;
