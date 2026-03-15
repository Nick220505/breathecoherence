import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { useTranslations } from 'next-intl';

import type { Message } from '@/features/chat/types';
import { cn } from '@/lib/utils';

import { messageVariants } from './animations';
import { ProductRecommendation } from './product-recommendation';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations('ChatMessage');
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      key={message.id}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'mb-4 flex flex-col',
        isAssistant ? 'items-start' : 'items-end',
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3',
          isAssistant
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground',
        )}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
        {message.products && message.products.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-semibold">{t('recommended_products')}</p>
            {message.products.map((product) => (
              <ProductRecommendation key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
