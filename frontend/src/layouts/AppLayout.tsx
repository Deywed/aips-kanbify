import { Outlet } from 'react-router-dom';

import LeftSidebar from '@/components/sidebar/LeftSidebar';

const AppLayout = () => {
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
