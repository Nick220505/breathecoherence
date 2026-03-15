'use client';

import { AnimatePresence } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import type { ChatResponse } from '@/features/chat/schemas';
import type { Message } from '@/features/chat/types';

import { ChatButton } from './chat-button';
import { ChatWindow } from './chat-window';

export function ChatBot() {
  const t = useTranslations('ChatBot');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now().toString(),
      role: 'assistant',
      content: t('welcome'),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 600);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: userMessage },
    ]);
    setIsTyping(true);

    try {
      const chatResponse = await fetch(`/api/chat?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          chatHistory: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const { response, recommendedProducts } =
        (await chatResponse.json()) as ChatResponse;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: response,
          products: recommendedProducts,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: t('error') },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <ChatButton key="chat-button" onClick={() => setIsOpen(true)} />
      ) : (
        <ChatWindow
          key="chat-window"
          messages={messages}
          input={input}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          inputRef={inputRef}
          onClose={() => setIsOpen(false)}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      )}
    </AnimatePresence>
  );
}
