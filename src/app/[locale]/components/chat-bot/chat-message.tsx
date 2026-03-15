import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

import type { Message } from '@/features/chat/types';

import { messageVariants } from './animations';
import { ProductRecommendation } from './product-recommendation';

interface ChatMessageProps {
  message: Message;
  recommendedProductsLabel: string;
  viewDetailsText: string;
}

export function ChatMessage({
  message,
  recommendedProductsLabel,
  viewDetailsText,
}: ChatMessageProps) {
  return (
    <motion.div
      key={message.id}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col ${
        message.role === 'assistant' ? 'items-start' : 'items-end'
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === 'assistant'
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
        {message.products && message.products.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-semibold">{recommendedProductsLabel}</p>
            {message.products.map((product) => {
              return (
                <ProductRecommendation
                  key={product.id}
                  product={product}
                  viewDetailsText={viewDetailsText}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
