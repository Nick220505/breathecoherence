'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Bot, MessageCircle, Minimize2, Send, X } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Message } from '@/features/chat/types';
import type { PartialProductWithCategory } from '@/features/product/types';
import { Link } from '@/i18n/routing';

const chatBotVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
  },
};

export function ChatBot() {
  const t = useTranslations('ChatBot');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: t('welcome'),
          id: Date.now().toString(),
        },
      ]);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractProductRecs = (message: string) => {
    const productRecs: PartialProductWithCategory[] = [];
    const seenProductIds = new Set<string>();
    const regex = /\[PRODUCT_REC\](.*?)\[\/PRODUCT_REC\]/g;
    let match;

    while ((match = regex.exec(message)) !== null) {
      try {
        const product = JSON.parse(match[1]) as PartialProductWithCategory;
        if (product.id && !seenProductIds.has(product.id)) {
          productRecs.push(product);
          seenProductIds.add(product.id);
        }
      } catch {
        continue;
      }
    }

    const cleanMessage = message
      .replace(/\[PRODUCT_REC\].*?\[\/PRODUCT_REC\]/g, '')
      .trim();
    return { cleanMessage, productRecs };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, id: Date.now().toString() },
    ]);
    setIsTyping(true);

    try {
      const processedMessage = userMessage;
      const chatResponse = await fetch(`/api/chat?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: processedMessage,
          chatHistory: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await chatResponse.json()) as { response: string };
      const finalResponse = data.response;
      const { cleanMessage, productRecs } = extractProductRecs(finalResponse);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: cleanMessage,
          id: Date.now().toString(),
          products: productRecs,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: t('error'), id: Date.now().toString() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.div
          key="chat-button"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={chatBotVariants}
          className="fixed right-4 bottom-4 z-50"
        >
          <motion.div animate={pulseAnimation}>
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-linear-to-r from-purple-600 to-blue-600 shadow-lg transition-shadow duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/20"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="chat-window"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={chatBotVariants}
          className="fixed right-4 bottom-4 z-50"
        >
          <Card className="bg-background/95 flex h-[600px] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border border-purple-500/20 py-0 shadow-2xl backdrop-blur-lg sm:w-[400px]">
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
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-colors duration-200 hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                  title={t('minimize')}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-colors duration-200 hover:bg-white/20"
                  onClick={() => {
                    setIsOpen(false);
                    setMessages([]);
                  }}
                  title={t('close')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((message) => (
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
                        <p className="font-semibold">
                          {t('recommended_products')}
                        </p>
                        {message.products.map((product) => {
                          return (
                            <div
                              key={product.id}
                              className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={
                                    product.imageBase64 ??
                                    (product.category?.name ===
                                    'Sacred Geometry'
                                      ? '/products/sacred-geometry.svg'
                                      : '/products/flower-essence.svg')
                                  }
                                  alt={product.name ?? 'Product image'}
                                  width={80}
                                  height={80}
                                  className="rounded-md"
                                />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-muted-foreground text-sm">
                                    $
                                    {typeof product.price === 'number'
                                      ? product.price.toFixed(2)
                                      : '0.00'}
                                  </p>
                                </div>
                              </div>
                              <Link
                                href={{
                                  pathname: '/store/product/[id]',
                                  params: { id: product.id ?? '' },
                                }}
                                className="text-primary text-sm hover:underline"
                              >
                                {t('view_details')}
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
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
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="h-2 w-2 rounded-full bg-purple-500"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="h-2 w-2 rounded-full bg-purple-500"
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {t('typing')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background/95 border-t p-4 backdrop-blur-lg"
            >
              <form
                onSubmit={(e) => void handleSubmit(e)}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('input_placeholder')}
                  disabled={isTyping}
                  className="bg-background/50 rounded-xl border-purple-500/20 text-sm focus:border-purple-500"
                />
                <Button
                  type="submit"
                  disabled={isTyping}
                  className="rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-4 shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/20"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
