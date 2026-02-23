import { type Dispatch, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { getDirtyValues } from '@/lib/utils';

import { useBoardInfo } from '@/stores/board.store';

import { newColumnSchema, type NewColumnSchemaType } from './newColumn.schema';
import { useUpdateColumnMutation } from '@/mutations/columns/useUpdateColumnMutation';
import { useCreateColumnMutation } from '@/mutations/columns/useCreateColumnMutation';
import type { Column } from '@/types/board.types';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { FieldGroup } from '@/components/ui/field';
import FormInput from '@/components/form/FormInput';

type BoardColumnDialogProps = {
  isOpen: boolean;
  open: Dispatch<SetStateAction<boolean>>;
  initialColumn?: Column;
};

const BoardColumnDialog = ({
  isOpen,
  open,
  initialColumn,
}: BoardColumnDialogProps) => {
  const form = useForm({
    resolver: zodResolver(newColumnSchema),
    defaultValues: {
      title: initialColumn?.title || '',
    },
    resetOptions: { keepDirty: false },
  });

  const {
    formState: { dirtyFields },
  } = form;

  const boardInfo = useBoardInfo();

  const createMutation = useCreateColumnMutation(boardInfo?.id || '');
  const updateMutation = useUpdateColumnMutation(
    boardInfo?.id || '',
    initialColumn?.id || '',
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: NewColumnSchemaType) => {
    if (initialColumn) {
      const dirtyValues = getDirtyValues(dirtyFields, data);

      if (Object.keys(dirtyValues).length === 0) {
        open(false);
        return;
      }

      updateMutation.mutate(dirtyValues, {
        onSuccess: () => {
          toast.success('Column updated successfully!');
          open(false);
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Column created successfully!');
          open(false);
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialColumn ? 'Edit Column' : 'New Column'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput
              control={form.control}
              name="title"
              label="Title"
              placeholder="e.g. To Do, In Progress, Done"
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
                  {initialColumn ? 'Save' : 'Create'}
                </LoadingSwap>
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BoardColumnDialog;
