import type { Notification } from '@/types/notification.types';

import UserAvatar from '@/components/common/UserAvatar';

import { BoardTitleLink, UserFullNameLink } from './FloatingNotificationCard';

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
        <UserFullNameLink user={notification.triggeredBy} /> {actionText}{' '}
        <BoardTitleLink board={notification.board} /> {roleText}
      </div>
    </div>
  );
};

export default BoardMemberNotification;
