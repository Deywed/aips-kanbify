import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

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
            Add, remove, or change roles of members on this board.
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="overflow-y-auto px-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <p key={index} className="mb-4 leading-normal">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          ))}
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
