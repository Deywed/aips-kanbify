import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Delete02Icon,
  Edit02Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import type { User } from '@/types/auth.types';
import { useAuthUser } from '@/stores/auth.store';

import { useUploadAvatarMutation } from '@/mutations/users/useUploadAvatarMutation';
import { useDeleteAvatarMutation } from '@/mutations/users/useDeleteAvatarMutation';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/ui/loading-button';
import UserAvatar from '@/components/common/UserAvatar';
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

type UserAvatarSectionProps = {
  user?: User;
};

const UserAvatarSection = ({ user }: UserAvatarSectionProps) => {
  const currentUser = useAuthUser();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const uploadMutation = useUploadAvatarMutation();
  const deleteMutation = useDeleteAvatarMutation();

  const isCurrentUser = currentUser?.id === user?.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      uploadMutation.mutate(formData, {
        onSuccess: (updatedUser) => {
          toast.success('Avatar updated successfully!');

          const img = new Image();
          img.src = updatedUser.avatarUrl || '';
          img.onload = () => {
            handleCancel();
          };
        },
      });
    }
  };

  const displayUser = previewUrl
    ? ({ ...user, avatarUrl: previewUrl } as User)
    : user;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        <UserAvatar user={displayUser} size={32} />
      </CardContent>

      {isCurrentUser && (
        <CardFooter className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {previewUrl ? (
            <>
              <LoadingButton
                variant="default"
                className="w-full sm:w-auto"
                onClick={handleSave}
                isLoading={uploadMutation.isPending}
              >
                <HugeiconsIcon icon={Tick02Icon} />
                Save
              </LoadingButton>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleCancel}
                disabled={uploadMutation.isPending}
              >
                <HugeiconsIcon icon={Cancel01Icon} />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => fileInputRef.current?.click()}
              >
                <HugeiconsIcon icon={Edit02Icon} />
                Change Avatar
              </Button>
              {user?.avatarUrl && (
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                  Delete
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}

      {isCurrentUser && (
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Avatar"
          description="Are you sure you want to delete your avatar? This action cannot be undone."
          onConfirm={() =>
            deleteMutation.mutate(undefined, {
              onSuccess: () => {
                toast.success('Avatar deleted successfully!');
                setIsDeleteDialogOpen(false);
              },
            })
          }
          isLoading={deleteMutation.isPending}
        />
      )}
    </Card>
  );
};

export default UserAvatarSection;
