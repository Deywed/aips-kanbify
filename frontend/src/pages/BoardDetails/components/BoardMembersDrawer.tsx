import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SearchMembers from './SearchMembers';
import MembersList from './MembersList';

type BoardMembersDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const BoardMembersDrawer = ({
  isOpen,
  onOpenChange,
}: BoardMembersDrawerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-lg">Manage board members</SheetTitle>
          <SheetDescription>
            Add, remove, or change roles of members on this board
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="overflow-x-auto overflow-y-auto">
          <Tabs defaultValue="members-list">
            <TabsList variant="line" className="w-full">
              <TabsTrigger value="members-list">Members list</TabsTrigger>
              <TabsTrigger value="add-new-member">
                <HugeiconsIcon icon={Add01Icon} />
                Add new member
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members-list" className="p-4">
              <MembersList />
            </TabsContent>

            <TabsContent value="add-new-member" className="p-4">
              <SearchMembers />
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <SheetFooter>
          <SheetClose
            className="mr-auto"
            render={
              <Button variant="outline">
                Close
                <HugeiconsIcon icon={ArrowRight02Icon} />
              </Button>
            }
          ></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BoardMembersDrawer;
