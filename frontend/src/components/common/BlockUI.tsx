import type { ReactNode } from 'react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';

import EmptyState from '@/components/common/EmptyState';
import { LoadingSwap } from '@/components/ui/loading-swap';

type Props = {
  isLoading: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  empty?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
};

const BlockUI = ({
  isLoading,
  isError = false,
  isEmpty = false,
  empty,
  error,
  children,
  className,
}: Props) => {
  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        <LoadingSwap isLoading>{children}</LoadingSwap>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('w-full', className)}>
        {error === undefined ? (
          <EmptyState
            icon={Cancel01Icon}
            title="Something went wrong"
            description="Please try again in a moment."
          />
        ) : (
          error
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn('w-full', className)}>
        {empty === undefined ? <EmptyState title="Nothing to show" /> : empty}
      </div>
    );
  }

  return <div className={cn('w-full', className)}>{children}</div>;
};

export default BlockUI;
