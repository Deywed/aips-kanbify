import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';

import type { Card } from '@/types/board.types';

import { useDeleteCardMutation } from '@/mutations/cards/useDeleteCardMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';
import ColumnCardDialog from './ColumnCardDialog';

type ColumnCardDropdownProps = {
  columnId: string;
  card: Card;
  className?: string;
};

const ColumnCardDropdown = ({
  columnId,
  card,
  className,
}: ColumnCardDropdownProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { mutate, isPending } = useDeleteCardMutation(columnId, card.id);

  const handleDeleteCard = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success('Card deleted successfully!');
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={className}
          render={
            <Button size="icon-sm" variant="outline">
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

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure you want to delete this card?"
        description="This action cannot be undone."
        onConfirm={handleDeleteCard}
        isLoading={isPending}
      />

      <ColumnCardDialog
        isOpen={isEditDialogOpen}
        open={setIsEditDialogOpen}
        columnId={columnId}
        initialCard={card}
      />
    </>
  );
};

export default ColumnCardDropdown;
