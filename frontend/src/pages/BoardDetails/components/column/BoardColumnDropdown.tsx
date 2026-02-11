import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import type { Column } from '@/types/board.types';

import { useBoardInfo } from '@/stores/board.store';

import { useDeleteColumnMutation } from '@/mutations/columns/useDeleteColumnMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

import BoardColumnDialog from './BoardColumnDialog';

type BoardColumnDropdownProps = {
  column: Column;
};

const BoardColumnDropdown = ({ column }: BoardColumnDropdownProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const boardInfo = useBoardInfo();

  const { mutate, isPending } = useDeleteColumnMutation(
    boardInfo?.id || '',
    column.id,
  );

  const handleDeleteColumn = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('Column deleted successfully!');
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="icon" variant="ghost">
              <HugeiconsIcon icon={MoreHorizontalIcon} />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <HugeiconsIcon icon={PencilEdit01Icon} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BoardColumnDialog
        isOpen={isEditDialogOpen}
        open={setIsEditDialogOpen}
        initialColumn={column}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={
          <>
            Are you sure you want to delete the column{' '}
            <span className="font-bold">{column.title}</span>?
          </>
        }
        description="This action cannot be undone. All cards within this column will also be deleted."
        onConfirm={handleDeleteColumn}
        isLoading={isPending}
      />
    </>
  );
};

export default BoardColumnDropdown;
