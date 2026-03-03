import type { ComponentPropsWithoutRef } from 'react';

import { Button } from './button';
import { LoadingSwap } from './loading-swap';

type LoadingButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  isLoading: boolean;
};

const LoadingButton = ({
  isLoading,
  disabled,
  children,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      <LoadingSwap isLoading={isLoading} className="flex items-center gap-1">
        {children}
      </LoadingSwap>
    </Button>
  );
};

export default LoadingButton;
