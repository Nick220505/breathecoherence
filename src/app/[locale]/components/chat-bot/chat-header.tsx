import { motion } from 'motion/react';
import { Bot, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  const t = useTranslations('ChatHeader');

  return (
    <motion.div
      className="flex items-center justify-between border-b bg-linear-to-r from-purple-600 to-blue-600 p-4 text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" />
        <h2 className="font-semibold">{t('title')}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 transition-colors duration-200 hover:bg-white/20"
        onClick={onClose}
        title={t('close')}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
