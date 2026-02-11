import { NavLink } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  Notification02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

import { APP_ROUTES } from '@/config/appRoutes';

import { useAuthUser } from '@/stores/auth.store';
import { useUnreadNotificationsCount } from '@/stores/notifications.store';

import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import CurrentUserAvatar from '@/components/common/CurrentUserAvatar';
import Logo from '@/components/common/Logo';

const sidebarLinks = [
  { label: 'My Boards', to: APP_ROUTES.BOARDS, icon: DashboardSquare01Icon },
  {
    label: 'Notifications',
    to: APP_ROUTES.NOTIFICATIONS,
    icon: Notification02Icon,
  },
  { label: 'Profile', to: APP_ROUTES.USERS, icon: UserIcon },
];

const LeftSidebar = () => {
  const user = useAuthUser();
  const unreadCount = useUnreadNotificationsCount();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col gap-8 border-r p-4">
      <Logo size={54} className="ml-2" />

      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => {
          const isNotifications = link.to === APP_ROUTES.NOTIFICATIONS;

          return (
            <NavLink
              to={
                link.to === APP_ROUTES.USERS && user
                  ? APP_ROUTES.USER_DETAILS(user.id)
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

              {isNotifications && unreadCount > 0 && (
                <Badge className="ml-auto">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto w-full pt-4">
        <CurrentUserAvatar />
      </div>
    </aside>
  );
};

export default LeftSidebar;
