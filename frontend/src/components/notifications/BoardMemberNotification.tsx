import { getUserFullName } from '@/lib/utils';
import { navigateTo } from '@/lib/navigation';

import type { Notification } from '@/types/notification.types';

import { APP_ROUTES } from '@/config/appRoutes';

import UserAvatar from '@/components/common/UserAvatar';

const BoardMemberNotification = ({
  notification,
  actionText,
  roleText,
}: {
  notification: Notification;
  actionText: string;
  roleText?: string;
}) => {
  return (
    <div className="flex gap-2">
      <UserAvatar user={notification.triggeredBy} size={10} />
      <div>
        <span
          className="hover:text-primary cursor-pointer font-bold underline-offset-4 hover:underline"
          onClick={() =>
            navigateTo(APP_ROUTES.USER_DETAILS(notification.triggeredBy.id))
          }
        >
          {getUserFullName(notification.triggeredBy)}
        </span>{' '}
        {actionText}{' '}
        <span
          className="hover:text-primary cursor-pointer font-bold underline-offset-4 hover:underline"
          onClick={() =>
            navigateTo(APP_ROUTES.BOARD_DETAILS(notification.board?.id ?? ''))
          }
        >
          {notification.board?.title}
        </span>{' '}
        {roleText}
      </div>
    </div>
  );
};

export default BoardMemberNotification;
