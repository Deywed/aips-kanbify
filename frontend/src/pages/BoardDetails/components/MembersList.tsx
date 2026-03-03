import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { roleToLabel } from '@/lib/utils';

import type { BoardMember } from '@/types/auth.types';
import type { BoardRole } from '@/types/board.types';
import { BOARD_ROLES } from '@/types/board.types';

import { useAuthUser } from '@/stores/auth.store';
import { useBoardInfo, useBoardMembers } from '@/stores/board.store';

import { useDeleteBoardMemberMutation } from '@/mutations/board-members/useDeleteBoardMemberMutation';
import { useUpdateBoardMemberRoleMutation } from '@/mutations/board-members/useUpdateBoardMemberRoleMutation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import UserDisplay from '@/components/common/UserDisplay';
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog';

const MembersList = () => {
  const boardMembers = useBoardMembers();

  return (
    <div className="flex flex-col gap-4">
      {boardMembers.map((member) => (
        <MembersListItem key={member.id} member={member} />
      ))}
    </div>
  );
};

type MembersListItem = {
  member: BoardMember;
};

const MembersListItem = ({ member }: MembersListItem) => {
  const currentUser = useAuthUser();
  const boardInfo = useBoardInfo();

  const [role, setRole] = useState(member.role);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: deleteMemberMutate, isPending: isDeletePending } =
    useDeleteBoardMemberMutation(boardInfo?.id || '', member.id);

  const { mutate: updateMemberRoleMutate, isPending: isUpdateRolePending } =
    useUpdateBoardMemberRoleMutation(boardInfo?.id || '', member.id);

  const isCurrentUser = currentUser?.id === member.id;

  const handleRoleChange = (nextRole: BoardRole) => {
    if (nextRole === role) {
      return;
    }

    setRole(nextRole);
    updateMemberRoleMutate(
      { role: nextRole },
      {
        onSuccess: () => {
          toast.success(
            `Updated @${member.username}'s role to ${roleToLabel(nextRole)}`,
          );
        },
      },
    );
  };

  const handleDeleteMember = () => {
    deleteMemberMutate(undefined, {
      onSuccess: () => {
        toast.success(`Removed @${member.username} from board`);
        setDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        <UserDisplay key={member.id} user={member} link />

        <ButtonGroup>
          <Button variant={role === 'ADMIN' ? 'default' : 'outline'} size="sm">
            {roleToLabel(role)}
          </Button>
          {!isCurrentUser && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={isUpdateRolePending}
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} />
                  </Button>
                }
              />
              <DropdownMenuContent className="z-100 w-32">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Role</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={role}
                    onValueChange={(value) =>
                      handleRoleChange(value as BoardRole)
                    }
                  >
                    {BOARD_ROLES.map((r) => (
                      <DropdownMenuRadioItem key={r} value={r}>
                        {roleToLabel(r)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </ButtonGroup>
      </div>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        isLoading={isDeletePending}
        title={`Remove @${member?.username} from board?`}
        description="This action cannot be undone. All their tasks will be unassigned."
        onConfirm={handleDeleteMember}
      />
    </>
  );
};

export default MembersList;
