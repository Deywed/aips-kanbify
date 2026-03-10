import { cn } from '@/lib/utils';

import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  hideSidebarTrigger?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Header = ({ hideSidebarTrigger, children, className }: HeaderProps) => {
  return (
    <div
      className={
        'bg-background/70 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex items-center gap-2 border-b p-4 backdrop-blur'
      }
    >
      {!hideSidebarTrigger && <SidebarTrigger size="icon" />}
      <div className={cn('w-full', className)}>{children}</div>
    </div>
  );
};

export default Header;
