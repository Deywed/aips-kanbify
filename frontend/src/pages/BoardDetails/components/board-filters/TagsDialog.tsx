import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, TagIcon, TagsIcon } from '@hugeicons/core-free-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { tagSchema, type TagSchemaType } from './tagSchema';

import { useBoardInfo, useBoardTags } from '@/stores/board.store';

import { useCreateTagMutation } from '@/mutations/tags/useCreateTagMutation';
import { useDeleteTagMutation } from '@/mutations/tags/useDeleteTagMutation';

import type { Tag } from '@/types/board.types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FormInput from '@/components/form/FormInput';
import { FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const TagsDialog = () => {
  const boardTags = useBoardTags();
  const boardInfo = useBoardInfo();

  const form = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
    },
  });

  const { mutate, isPending } = useCreateTagMutation(boardInfo.id || '');

  const onSubmit = (data: TagSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        toast.success(`Tag "${data.name}" created successfully`);
        form.reset();
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <HugeiconsIcon icon={TagsIcon} />
            Tags
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Create and manage tags to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="-mx-4 max-h-[70vh]">
          <div className="mx-4 flex flex-col gap-6">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="gap-4">
                <FormInput
                  control={form.control}
                  name="name"
                  placeholder="e.g. Urgent, Bug, Feature"
                />
                <Button type="submit" className="ml-auto w-fit">
                  <LoadingSwap isLoading={isPending}>Create</LoadingSwap>
                </Button>
              </FieldGroup>
            </form>

            <div className="flex flex-col gap-4">
              {boardTags.map((tag) => (
                <TagItem key={tag.id} tag={tag} />
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

type TagItemProps = {
  tag: Tag;
};

const TagItem = ({ tag }: TagItemProps) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const boardInfo = useBoardInfo();

  const { mutate: deleteTag, isPending } = useDeleteTagMutation(
    boardInfo.id || '',
    tag.id,
  );

  const handleDeleteTag = () => {
    deleteTag(undefined, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div className="bg-card flex items-center gap-2 rounded-md border p-4">
        <HugeiconsIcon icon={TagIcon} size={16} />
        <span>{tag.name}</span>

        <Button
          variant="destructive"
          size="icon-sm"
          className="ml-auto"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <HugeiconsIcon icon={Delete02Icon} />
        </Button>
      </div>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Are you sure you want to delete the tag "${tag.name}"?`}
        description="This action cannot be undone."
        isLoading={isPending}
        onConfirm={handleDeleteTag}
      />
    </>
  );
};

export default TagsDialog;
