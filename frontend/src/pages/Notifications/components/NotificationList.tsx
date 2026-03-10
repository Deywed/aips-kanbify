import type { Notification } from '@/types/notification.types';

import { Card } from '@/components/ui/card';

import NotificationItem from './NotificationItem';

type NotificationListProps = {
  notifications: Notification[];
};

const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <Card className="mx-auto w-full max-w-3xl p-0">
      <div className="flex flex-col">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            isLast={index === notifications.length - 1}
          />
        ))}
      </div>
    </Card>
  );
};

export default NotificationList;
