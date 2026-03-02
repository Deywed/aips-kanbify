import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, Edit02Icon } from '@hugeicons/core-free-icons';

import { formatDate, getUserFullName } from '@/lib/utils';

import { API_ENDPOINTS } from '@/config/endpoints';

import type { User } from '@/types/auth.types';

import { useAuthUser } from '@/stores/auth.store';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import H2 from '@/components/ui/typography/H2';
import H4 from '@/components/ui/typography/H4';
import Header from '@/components/common/Header';
import BlockUI from '@/components/common/BlockUI';

import UserInfoFormDialog from './components/UserInfoFormDialog';
import UserAvatarSection from './components/UserAvatarSection';

const ProfilePage = () => {
  const { id } = useParams();

  const currentUser = useAuthUser();

  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<User>({
    queryKey: [API_ENDPOINTS.USER(id!)],
    enabled: !!id,
  });

  return (
    <>
      <Header className="flex justify-between gap-4">
        <H2>{isError ? 'Error loading user profile' : 'User Profile'}</H2>
      </Header>

      <div className="flex size-full p-4">
        <BlockUI isLoading={isLoading} isError={isError}>
          <div className="flex flex-col gap-4 md:flex-row">
            <UserAvatarSection user={data} />

            <Card className="flex-1">
              <CardHeader className="flex justify-between gap-4">
                <div>
                  <CardTitle>User Info</CardTitle>
                  <CardDescription>
                    Basic information about the user
                  </CardDescription>
                </div>
                {currentUser?.id === data?.id && (
                  <Button
                    variant="outline"
                    onClick={() => setIsUserInfoDialogOpen(true)}
                  >
                    <HugeiconsIcon icon={Edit02Icon} />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <H4>
                    {getUserFullName(data)}{' '}
                    <span className="text-muted-foreground font-light">
                      | @{data?.username}
                    </span>
                  </H4>
                  <span className="text-muted-foreground">{data?.email}</span>
                </div>

                {data?.bio && <span>{data?.bio}</span>}
              </CardContent>

              <CardFooter className="mt-auto justify-end border-t">
                <span className="flex items-center gap-2">
                  <HugeiconsIcon icon={Calendar03Icon} size={18} />
                  Joined {data ? formatDate(data.createdAt) : 'unknown'}
                </span>
              </CardFooter>
            </Card>
          </div>
        </BlockUI>
      </div>

      {isLoading || isError ? null : (
        <UserInfoFormDialog
          isOpen={isUserInfoDialogOpen}
          open={setIsUserInfoDialogOpen}
          user={data}
        />
      )}
    </>
  );
};

export default ProfilePage;
