import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserFullName } from '@/lib/utils';
import { toast } from 'sonner';

import type { Card } from '@/types/board.types';
import { cardSchema, type CardSchemaType } from './newCard.schema';

import { useCreateCardMutation } from '@/mutations/cards/useCreateCardMutation';

import { useBoardMembers, useBoardTags } from '@/stores/board.store';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { FieldGroup } from '@/components/ui/field';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { SelectItem } from '@/components/ui/select';

import FormInput from '@/components/form/FormInput';
import FormTextarea from '@/components/form/FormTextarea';
import FormBasicDatePicker from '@/components/form/FormBasicDatePicker';
import FormSelect from '@/components/form/FormSelect';
import FormComboboxMulti from '@/components/form/FormComboboxMulti';

import UserAvatar from '@/components/common/UserAvatar';
import UserDisplay from '@/components/common/UserDisplay';

type ColumnCardDialogProps = {
  isOpen: boolean;
  open: Dispatch<SetStateAction<boolean>>;
  columnId: string;
  initialCard?: Card;
};

const ColumnCardDialog = ({
  isOpen,
  open,
  columnId,
  initialCard,
}: ColumnCardDialogProps) => {
  const boardMembers = useBoardMembers();
  const tags = useBoardTags();

  useEffect(() => {
    if (!isOpen) return;

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  }, [isOpen]);

  const form = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: initialCard?.title || '',
      description: initialCard?.description || '',
      dueDate: initialCard?.dueDate ? new Date(initialCard.dueDate) : undefined,
      assignedToId: initialCard?.assignedTo?.id || undefined,
      tagIds: initialCard?.tags.map((tag) => tag.id) || [],
    },
  });

  const createMutation = useCreateCardMutation(columnId);

  const isPending = createMutation.isPending;

  const onSubmit = async (data: CardSchemaType) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        open(false);

        toast.success('Card created successfully');
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open} disablePointerDismissal>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {initialCard ? 'Edit card' : 'Create new card'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="-mx-6 max-h-[80vh]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-6">
            <FieldGroup>
              <FormInput
                control={form.control}
                name="title"
                label="Title"
                placeholder="e.g. Design homepage"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="e.g. Create a modern and responsive design for the homepage."
                maxLength={2000}
              />

              <FormComboboxMulti
                control={form.control}
                name="tagIds"
                label="Tags"
                placeholder="Select tags..."
                items={tags}
                getValue={(t) => t.id}
                getSearchText={(tag) => tag.name}
                renderItem={(tag) => tag.name}
                renderChip={(id) => {
                  const tag = tags.find((t) => t.id === id);
                  return tag?.name;
                }}
              />

              <FormSelect
                control={form.control}
                name="assignedToId"
                label="Assign to"
                placeholder="Select a user..."
                renderValue={(value) => {
                  const user = boardMembers.find(
                    (member) => member.id === value,
                  );
                  return user ? (
                    <>
                      <UserAvatar user={user} size={6} />
                      {getUserFullName(user)}
                    </>
                  ) : (
                    'Unassigned'
                  );
                }}
              >
                <SelectItem value="">Unassigned</SelectItem>
                {boardMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <UserDisplay user={member} />
                  </SelectItem>
                ))}
              </FormSelect>

              <FormBasicDatePicker
                control={form.control}
                name="dueDate"
                label="Due Date"
                calendarProps={{
                  disabled: {
                    before: new Date(),
                  },
                }}
              />

              <DialogFooter>
                <DialogClose
                  onClick={() => form.reset()}
                  render={
                    <Button variant="ghost" type="button">
                      Cancel
                    </Button>
                  }
                />
                <Button type="submit" disabled={isPending}>
                  <LoadingSwap isLoading={isPending}>
                    {initialCard ? 'Save' : 'Create Card'}
                  </LoadingSwap>
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnCardDialog;
