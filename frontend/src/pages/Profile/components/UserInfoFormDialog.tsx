import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useAuthActions } from '@/stores/auth.store';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  userInfoSchema,
  type UserInfoSchemaType,
} from '../schema/userInfo.schema';

import type { User } from '@/types/auth.types';

import { useEditProfileInfoMutation } from '@/mutations/users/useEditProfileMutation';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import FormInput from '@/components/form/FormInput';
import FormTextarea from '@/components/form/FormTextarea';
import { LoadingSwap } from '@/components/ui/loading-swap';

const MAX_BIO_LENGTH = 160;

type UserInfoFormDialogProps = {
  isOpen: boolean;
  open: Dispatch<SetStateAction<boolean>>;
  user?: User;
};

const UserInfoFormDialog = ({
  isOpen,
  open,
  user,
}: UserInfoFormDialogProps) => {
  const form = useForm({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    },
  });

  const { setUser } = useAuthActions();

  const { isPending, mutate } = useEditProfileInfoMutation();

  async function onSubmit(data: UserInfoSchemaType) {
    mutate(data, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser);

        form.reset({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          bio: updatedUser.bio ?? '',
        });

        toast.success('Profile updated successfully!');
        open(false);
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-7"
        >
          <div className="flex flex-col items-start gap-7 sm:flex-row">
            <FormInput
              control={form.control}
              name="firstName"
              label="First Name"
            />

            <FormInput
              control={form.control}
              name="lastName"
              label="Last Name"
            />
          </div>

          <FormTextarea
            control={form.control}
            name="bio"
            label="Bio"
            maxLength={MAX_BIO_LENGTH}
            placeholder="Tell us about yourself..."
          />

          <DialogFooter>
            <DialogClose
              onClick={() => form.reset()}
              render={<Button variant="ghost">Cancel</Button>}
            />
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              <LoadingSwap isLoading={isPending}>Save</LoadingSwap>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoFormDialog;
