import { NavLink, useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  Notification02Icon,
  Task01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

import { APP_ROUTES } from '@/config/appRoutes';

import { useAuthUser } from '@/stores/auth.store';
import { useUnreadNotificationsCount } from '@/stores/notifications.store';

import CurrentUserAvatar from '@/components/common/CurrentUserAvatar';
import Logo from '@/components/common/Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const sidebarLinks = [
  { label: 'My Boards', to: APP_ROUTES.BOARDS, icon: DashboardSquare01Icon },
  { label: 'Assigned Cards', to: APP_ROUTES.ASSIGNED_CARDS, icon: Task01Icon },
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

  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo size={54} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map((link) => {
                const isNotifications = link.to === APP_ROUTES.NOTIFICATIONS;
                const isLinkActive = pathname.startsWith(link.to);

                return (
                  <SidebarMenuItem key={link.label}>
                    <SidebarMenuButton
                      tooltip={link.label}
                      render={
                        <NavLink
                          to={
                            link.to === APP_ROUTES.USERS && user
                              ? APP_ROUTES.USER_DETAILS(user.id)
                              : link.to
                          }
                        >
                          <HugeiconsIcon icon={link.icon} />

                          <span>{link.label}</span>
                        </NavLink>
                      }
                      isActive={isLinkActive}
                    />

                    {isNotifications && unreadCount > 0 && (
                      <SidebarMenuBadge>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <CurrentUserAvatar />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default LeftSidebar;
