import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SentIcon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChatInput = ({ onSend }: { onSend: (msg: string) => void }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t p-4">
      <Input
        placeholder="Type a message..."
        className="flex-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={2000}
      />
      <Button
        size="icon"
        variant="outline"
        onClick={handleSend}
        disabled={!input.trim()}
      >
        <HugeiconsIcon icon={SentIcon} />
      </Button>
    </div>
  );
};

export default ChatInput;
