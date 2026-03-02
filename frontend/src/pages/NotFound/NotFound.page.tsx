import { useNavigate } from 'react-router-dom';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import Logo from '@/components/common/Logo';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex h-screen w-fit items-center justify-center">
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia>
            <Logo size={64} />
          </EmptyMedia>
          <EmptyTitle>Oops! Nothing here...</EmptyTitle>
          <EmptyDescription>
            It seems we can&apos;t find the data you&apos;re looking for.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-row items-center justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <HugeiconsIcon icon={ArrowLeft02Icon} />
            Go Back
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
};

export default NotFoundPage;
