import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  Notification02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

import { useAuthUser } from '@/stores/auth.store';

import { buttonVariants } from '@/components/ui/button';

import CurrentUserAvatar from '@/components/common/CurrentUserAvatar';
import Logo from '@/components/common/Logo';

const sidebarLinks = [
  { label: 'My Boards', to: '/', icon: DashboardSquare01Icon },
  { label: 'Notifications', to: '/notifications', icon: Notification02Icon },
  { label: 'Profile', to: '/users', icon: UserIcon },
];

const LeftSidebar = () => {
  const user = useAuthUser();

  return (
    <aside className="sticky top-0 flex h-screen min-w-64 flex-col gap-4 border-r p-4">
      <Logo size={54} />

      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => {
          return (
            <NavLink
              to={
                link.to === '/users' && user
                  ? `/users/${user.username}`
                  : link.to
              }
              key={link.label}
              className={({ isActive }) =>
                cn(
                  buttonVariants({
                    variant: isActive ? 'outline' : 'ghost',
                    size: 'lg',
                  }),
                  'w-full justify-start',
                  isActive && 'font-semibold',
                )
              }
            >
              <HugeiconsIcon icon={link.icon} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto w-full border-t pt-4">
        <CurrentUserAvatar />
      </div>
    </aside>
  );
};

export default LeftSidebar;
