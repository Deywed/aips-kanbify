import { useUserBoardRole } from '@/stores/board.store';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const BoardAdminGuard = ({ children, fallback = null }: Props) => {
  const role = useUserBoardRole();

  if (role === 'ADMIN') {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
