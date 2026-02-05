import { PackageSearchIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type Props = {
  title: string;
  description?: string;
  icon?: typeof PackageSearchIcon;
  content?: React.ReactNode;
  className?: string;
};

const EmptyState = ({
  title,
  description,
  icon = PackageSearchIcon,
  content,
  className,
}: Props) => {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={icon} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="leading-snug">
          {description || 'There is nothing to show here at the moment.'}
        </EmptyDescription>
      </EmptyHeader>
      {content && <EmptyContent>{content}</EmptyContent>}
    </Empty>
  );
};

export default EmptyState;
