import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon, Logout05Icon } from '@hugeicons/core-free-icons';

import { useAuthUser, useAuthActions } from '@/stores/auth.store';

import { useLogoutMutation } from '@/mutations/auth/useLogoutMutation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';

import { ThemeDropdownMenuItem } from './common/ThemeToggle';

const UserDropdown = () => {
  const user = useAuthUser();

  if (!user) return null;

  const avatarFallback = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-muted dark:hover:bg-muted/50 flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 transition-colors">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col text-left text-sm">
          <span className="truncate font-semibold">{fullName}</span>
          <span className="text-muted-foreground truncate">{`@${user.username}`}</span>
        </div>

        <HugeiconsIcon icon={MoreHorizontalIcon} className="shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <LogoutDropdownItem />
        <DropdownMenuSeparator />
        <ThemeDropdownMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

const LogoutDropdownItem = () => {
  const navigate = useNavigate();

  const { logout } = useAuthActions();

  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        logout();
        navigate('/login', { replace: true });
      },
    });
  };

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? <Spinner /> : <HugeiconsIcon icon={Logout05Icon} />}
      Logout
    </DropdownMenuItem>
  );
};
