import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

import { LoadingSwap } from '@/components/ui/loading-swap';

import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';

type StateOverrides = {
  empty?: ReactNode;
  error?: ReactNode;
  loading?: ReactNode;
};

type Props = {
  isLoading: boolean;
  isError?: boolean | unknown;
  isEmpty?: boolean;
  emptyContent?: ReactNode;

  children: ReactNode;

  overrides?: StateOverrides;
  className?: string;
};

const BlockUI = ({
  isLoading,
  isError = false,
  isEmpty = false,
  emptyContent,
  children,
  overrides,
  className,
}: Props) => {
  if (isLoading) {
    return (
      <div className={cn('flex h-full w-full justify-center', className)}>
        {overrides?.loading ? (
          overrides.loading
        ) : (
          <LoadingSwap isLoading>{children}</LoadingSwap>
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex h-full w-full justify-center', className)}>
        {overrides?.error ? overrides.error : <ErrorState />}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn('flex h-full w-full justify-center', className)}>
        {overrides?.empty ? (
          overrides.empty
        ) : (
          <EmptyState title="No data found" content={emptyContent} />
        )}
      </div>
    );
  }

  return <div className={cn('w-full', className)}>{children}</div>;
};

export default BlockUI;
