"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { type Product } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Minimize2, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  products?: Partial<Product>[];
}

const chatBotVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

const messageVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3,
    },
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export function ChatBot() {
  const t = useTranslations("ChatBot");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: t("welcome"),
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
    const productRecs: Partial<Product>[] = [];
    const regex = /\[PRODUCT_REC\](.*?)\[\/PRODUCT_REC\]/g;
    let match;

    while ((match = regex.exec(message)) !== null) {
      try {
        const product = JSON.parse(match[1]);
        productRecs.push(product);
      } catch (e) {
        console.error("Failed to parse product recommendation:", e);
      }
    }

    const cleanMessage = message.replace(
      /\[PRODUCT_REC\].*?\[\/PRODUCT_REC\]/g,
      "",
    );
    return { cleanMessage, productRecs };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, id: Date.now().toString() },
    ]);
    setIsTyping(true);

    try {
      const processedMessage = userMessage;
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: processedMessage,
          chatHistory: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await chatResponse.json();
      const finalResponse = data.response;
      const { cleanMessage, productRecs } = extractProductRecs(finalResponse);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleanMessage,
          id: Date.now().toString(),
          products: productRecs,
        },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("error"), id: Date.now().toString() },
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
          className="fixed bottom-4 right-4 z-50"
        >
          <motion.div animate={pulseAnimation}>
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300"
            >
              <MessageCircle className="w-6 h-6" />
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
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] shadow-2xl flex flex-col bg-background/95 backdrop-blur-lg border border-purple-500/20 rounded-2xl overflow-hidden">
            <motion.div
              className="p-4 border-b flex justify-between items-center bg-linear-to-r from-purple-600 to-blue-600 text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h2 className="font-semibold">{t("title")}</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/20 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                  title={t("minimize")}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/20 transition-colors duration-200"
                  onClick={() => {
                    setIsOpen(false);
                    setMessages([]);
                  }}
                  title={t("close")}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex flex-col ${
                    message.role === "assistant" ? "items-start" : "items-end"
                  } mb-4`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                    {message.products && message.products.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="font-semibold">
                          {t("recommended_products")}
                        </p>
                        {message.products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <Image
                                src={
                                  product.imageUrl ||
                                  "/images/default-product.jpg"
                                }
                                alt={product.name || ""}
                                width={40}
                                height={40}
                                className="rounded-md"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  $
                                  {typeof product.price === "number"
                                    ? product.price.toFixed(2)
                                    : "0.00"}
                                </p>
                              </div>
                            </div>
                            <Link
                              href={{
                                pathname: "/store/product/[id]",
                                params: { id: product.id || "" },
                              }}
                              className="text-sm text-primary hover:underline"
                            >
                              {t("view_details")}
                            </Link>
                          </div>
                        ))}
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
                  <div className="max-w-[85%] p-3 rounded-2xl bg-gray-100 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-purple-500"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="w-2 h-2 rounded-full bg-purple-500"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="w-2 h-2 rounded-full bg-purple-500"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {t("typing")}
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
              className="p-4 border-t bg-background/95 backdrop-blur-lg"
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("input_placeholder")}
                  disabled={isTyping}
                  className="border-purple-500/20 focus:border-purple-500 text-sm rounded-xl bg-background/50"
                />
                <Button
                  type="submit"
                  disabled={isTyping}
                  className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 rounded-xl px-4 shadow-lg hover:shadow-purple-500/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
