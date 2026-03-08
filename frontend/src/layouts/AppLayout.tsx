import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { setNavigator } from '@/lib/navigation';

import { useInitNotifications } from '@/hooks/notifications/useInitNotifications';

import { SidebarProvider } from '@/components/ui/sidebar';

import LeftSidebar from '@/components/sidebar/LeftSidebar';

const AppLayout = () => {
  useInitNotifications();

  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <SidebarProvider className="flex">
      <LeftSidebar />

      <main className="flex h-screen min-w-0 flex-1 flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AppLayout;
