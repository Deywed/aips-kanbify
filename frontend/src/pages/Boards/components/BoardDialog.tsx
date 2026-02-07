import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  newBoardSchema,
  type NewBoardSchemaType,
} from '../schema/newBoard.schema';

import { useCreateBoardMutation } from '@/mutations/boards/createBoardMutation';

import FormInput from '@/components/form/FormInput';
import FormTextarea from '@/components/form/FormTextarea';
import { FieldGroup } from '@/components/ui/field';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type BoardDialogProps = {
  isOpen: boolean;
  open: Dispatch<SetStateAction<boolean>>;
};

const BoardDialog = ({ isOpen, open }: BoardDialogProps) => {
  const form = useForm({
    resolver: zodResolver(newBoardSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const { mutate, isPending } = useCreateBoardMutation();

  const onSubmit = async (data: NewBoardSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        open(false);
        toast.success('Board created successfully!');
        form.reset();
      },
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={open}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new board</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FormInput
                control={form.control}
                name="title"
                label="Title"
                placeholder="e.g. Project Alpha"
              />

              <FormTextarea
                control={form.control}
                name="description"
                label="Description"
                placeholder="e.g. This board is for tracking the progress of Project Alpha"
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
                  <LoadingSwap isLoading={isPending}>Create</LoadingSwap>
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoardDialog;
