import { motion } from 'motion/react';
import { Bot, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  title: string;
  closeLabel: string;
  onClose: () => void;
}

export function ChatHeader({ title, closeLabel, onClose }: ChatHeaderProps) {
  return (
    <motion.div
      className="flex items-center justify-between border-b bg-linear-to-r from-purple-600 to-blue-600 p-4 text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 transition-colors duration-200 hover:bg-white/20"
        onClick={onClose}
        title={closeLabel}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
