import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type HeaderProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
};

const Header = ({ children, isLoading, className }: HeaderProps) => {
  return (
    <div
      className={cn(
        'bg-background/70 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 flex items-center gap-2 border-b p-4 backdrop-blur',
        className,
      )}
    >
      {isLoading ? <Skeleton className="h-6 w-32" /> : children}
    </div>
  );
};

export default Header;
