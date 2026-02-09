import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

import type { Notification } from '@/types/notification.types';

import { Button } from '@/components/ui/button';

type FloatingNotificationCardProps = {
  notification: Notification;
  onDismiss: () => void;
};

const FloatingNotificationCard = ({
  notification,
  onDismiss,
}: FloatingNotificationCardProps) => {
  return (
    <div className="bg-card relative flex flex-col gap-2 rounded-xl border p-4 shadow-xl">
      {notification.id}

      <Button
        variant="secondary"
        size="icon-xs"
        className="absolute -top-2 -left-2"
      >
        <HugeiconsIcon icon={Cancel01Icon} onClick={onDismiss} />
      </Button>
    </div>
  );
};

export default FloatingNotificationCard;
