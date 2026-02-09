import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import type { Board } from '@/types/board.types';

import { useDeleteBoardMutation } from '@/mutations/boards/useDeleteBoardMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

import BoardDialog from './BoardDialog';

type BoardCardDropdownProps = {
  board: Board;
};

const BoardCardDropdown = ({ board }: BoardCardDropdownProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: mutateDeleteBoard, isPending: isPendingDelete } =
    useDeleteBoardMutation(board.id);

  const handleDeleteBoard = () => {
    mutateDeleteBoard(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('Board deleted successfully!');
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
          {board.role === 'ADMIN' && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <HugeiconsIcon icon={Delete02Icon} />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <BoardDialog
        isOpen={isEditDialogOpen}
        open={setIsEditDialogOpen}
        initialBoard={board}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure you want to delete this board?"
        description="This action cannot be undone and all associated data will be lost."
        onConfirm={handleDeleteBoard}
        isLoading={isPendingDelete}
      />
    </>
  );
};

export default BoardCardDropdown;
