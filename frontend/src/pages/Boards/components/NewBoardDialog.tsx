import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';

const NewBoardDialog = () => {
  return (
    <Button>
      <HugeiconsIcon icon={Add01Icon} /> New Board
    </Button>
  );
};

export default NewBoardDialog;
