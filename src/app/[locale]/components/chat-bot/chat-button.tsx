import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { chatBotVariants, pulseAnimation } from './animations';

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={chatBotVariants}
      className="fixed right-4 bottom-4 z-50"
    >
      <motion.div animate={pulseAnimation}>
        <Button
          onClick={onClick}
          className="h-14 w-14 rounded-full bg-linear-to-r from-purple-600 to-blue-600 shadow-lg transition-shadow duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/20"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
