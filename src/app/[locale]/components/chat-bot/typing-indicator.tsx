import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

export function TypingIndicator() {
  const t = useTranslations('TypingIndicator');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] rounded-2xl bg-gray-100 p-3 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-purple-500"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="h-2 w-2 rounded-full bg-purple-500"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="h-2 w-2 rounded-full bg-purple-500"
            />
          </div>
          <span className="text-muted-foreground text-sm">{t('typing')}</span>
        </div>
      </div>
    </motion.div>
  );
}
