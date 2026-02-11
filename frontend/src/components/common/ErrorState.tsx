import { Alert02Icon } from '@hugeicons/core-free-icons'; // Ili bilo koja ikonica za grešku
import { HugeiconsIcon } from '@hugeicons/react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

type Props = {
  title?: string;
  description?: string;
  icon?: typeof Alert02Icon;
  content?: React.ReactNode;
  className?: string;
  onRetry?: () => void;
};

const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error while loading data.',
  icon = Alert02Icon,
  content,
  className,
  onRetry,
}: Props) => {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia className="text-destructive">
          <HugeiconsIcon icon={icon} />
        </EmptyMedia>
        <EmptyTitle className="text-destructive">{title}</EmptyTitle>
        <EmptyDescription className="text-destructive/80 leading-snug">
          {description}
        </EmptyDescription>
      </EmptyHeader>

      {(content || onRetry) && (
        <EmptyContent>
          {content}
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
        </EmptyContent>
      )}
    </Empty>
  );
};

export default ErrorState;
