import { Outlet } from 'react-router-dom';

import { useInitNotifications } from '@/hooks/notifications/useInitNotifications';

import LeftSidebar from '@/components/sidebar/LeftSidebar';

const AppLayout = () => {
  useInitNotifications();

  return (
    <div className="flex">
      <LeftSidebar />

      <main className="flex size-full flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
