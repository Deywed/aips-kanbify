import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Delete02Icon,
  Edit02Icon,
  TagIcon,
  TagsIcon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { tagSchema, type TagSchemaType } from './tagSchema';

import { useBoardInfo, useBoardTags } from '@/stores/board.store';

import { useCreateTagMutation } from '@/mutations/tags/useCreateTagMutation';
import { useDeleteTagMutation } from '@/mutations/tags/useDeleteTagMutation';
import { useUpdateTagMutation } from '@/mutations/tags/useUpdateTagMutation';

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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSwap } from '@/components/ui/loading-swap';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

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
  const [isEditMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(tag.name);

  const boardInfo = useBoardInfo();

  const { mutate: updateTag, isPending: isUpdating } = useUpdateTagMutation(
    boardInfo.id || '',
    tag.id,
  );

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

  const handleUpdateTag = (name: string) => {
    if (name === tag.name || name.trim() === '') {
      setEditMode(false);
      return;
    }

    updateTag(
      { name },
      {
        onSuccess: (tag) => {
          toast.success(`Tag renamed to "${name}"`);
          setEditMode(false);
          setEditValue(tag.name);
        },
      },
    );
  };

  return (
    <>
      <div className="bg-card flex items-center gap-4 rounded-md border p-4">
        <HugeiconsIcon
          icon={TagIcon}
          size={16}
          className="text-muted-foreground shrink-0"
        />
        {isEditMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTag(editValue);
            }}
            className="w-full"
          >
            <InputGroup>
              <InputGroupInput
                defaultValue={tag.name}
                autoFocus
                onChange={(e) => setEditValue(e.target.value)}
              />

              <InputGroupAddon align="inline-end" className="gap-1">
                <InputGroupButton
                  variant="outline"
                  size="icon-xs"
                  disabled={isUpdating}
                  type="submit"
                >
                  <LoadingSwap isLoading={isUpdating}>
                    <HugeiconsIcon icon={Tick01Icon} />
                  </LoadingSwap>
                </InputGroupButton>

                <InputGroupButton
                  variant="outline"
                  size="icon-xs"
                  type="button"
                  onClick={() => setEditMode(false)}
                >
                  <HugeiconsIcon icon={Cancel01Icon} />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
        ) : (
          <div
            onClick={() => setEditMode(true)}
            className="group flex flex-1 cursor-pointer items-center gap-2"
          >
            <span>{tag.name}</span>
            <HugeiconsIcon
              icon={Edit02Icon}
              size={16}
              className="hidden group-hover:block"
            />
          </div>
        )}

        {!isEditMode && (
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} />
          </Button>
        )}
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
