import { motion } from 'motion/react';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  inputRef,
}: ChatInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-background/95 border-t p-4 backdrop-blur-lg"
    >
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="bg-background/50 rounded-xl border-purple-500/20 text-sm focus:border-purple-500"
        />
        <Button
          type="submit"
          disabled={disabled}
          className="rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-4 shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/20"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
}
