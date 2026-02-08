import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SearchMembers from './SearchMembers';

type BoardMembersDrawerProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const BoardMembersDrawer = ({
  isOpen,
  onOpenChange,
}: BoardMembersDrawerProps) => {
  return (
    <Drawer direction="right" open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Manage board members</DrawerTitle>
          <DrawerDescription>
            Add, remove, or change roles of members on this board
          </DrawerDescription>
        </DrawerHeader>

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
              members list here...
            </TabsContent>

            <TabsContent value="add-new-member" className="p-4">
              <SearchMembers />
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose className="mr-auto">
            <Button variant="outline">
              Close
              <HugeiconsIcon icon={ArrowRight02Icon} />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BoardMembersDrawer;
