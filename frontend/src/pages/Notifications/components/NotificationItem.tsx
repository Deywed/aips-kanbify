import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import { formatRelativeDate } from '@/lib/utils';

import type { Notification } from '@/types/notification.types';

import { useDeleteNotificationMutation } from '@/mutations/notifications/useDeleteNotificationMutation';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import UserAvatar from '@/components/common/UserAvatar';
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

import NotificationBody from './NotificationBody';
import { notificationMeta } from './notificationMeta';

type NotificationItemProps = {
  notification: Notification;
  isLast: boolean;
};

const NotificationItem = ({ notification, isLast }: NotificationItemProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate, isPending } = useDeleteNotificationMutation(notification.id);

  const meta = notificationMeta[notification.type];

  const handleDeleteNotification = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('Notification deleted successfully');
      },
    });
  };

  return (
    <>
      <div className="group flex gap-4 p-4">
        <UserAvatar user={notification.triggeredBy} link />

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="default">
              <HugeiconsIcon icon={meta.icon} />
              {meta.label}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {formatRelativeDate(notification.createdAt)}
            </span>
            <Button
              size="icon"
              variant="destructive"
              className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <HugeiconsIcon icon={Delete02Icon} />
            </Button>
          </div>

          <NotificationBody notification={notification} />
        </div>
      </div>

      {!isLast && <Separator />}

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure you want to delete this notification?"
        onConfirm={handleDeleteNotification}
        isLoading={isPending}
      />
    </>
  );
};

export default NotificationItem;
