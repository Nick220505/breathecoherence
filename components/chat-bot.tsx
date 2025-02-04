"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getChatResponse } from "@/lib/gemini";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Minimize2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string; // Add unique ID for animations
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage =
        language === "es"
          ? "¡Bienvenido a nuestro Asistente de Compras! 👋\n\nPuedo ayudarte con:\n\n1. Productos de Geometría Sagrada\n• Información sobre nuestros Sólidos Platónicos\n• Sus asociaciones elementales\n• Propiedades metafísicas\n• Precios y disponibilidad\n\n2. Remedios Florales de Bach\n• Información sobre cada esencia\n• Beneficios emocionales\n• Recomendaciones personalizadas\n\n¿En qué puedo ayudarte hoy?"
          : "Welcome to Our Shopping Assistant! 👋\n\nI can help you with:\n\n1. Sacred Geometry Products\n• Information about our Platonic Solids\n• Their elemental associations\n• Metaphysical properties\n• Pricing and availability\n\n2. Bach Flower Remedies\n• Information about each essence\n• Emotional benefits\n• Personalized recommendations\n\nHow can I assist you today?";

      setMessages([
        {
          role: "assistant",
          content: welcomeMessage,
          id: Date.now().toString(),
        },
      ]);
    }
    // Focus input when chat opens
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, language, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, id: Date.now().toString() },
    ]);
    setIsLoading(true);

    try {
      let processedMessage = userMessage;
      if (language === "es") {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userMessage, targetLanguage: "en" }),
        });
        const data = await response.json();
        if (data.translatedText) {
          processedMessage = data.translatedText;
        }
      }

      const chatResponse = await getChatResponse(processedMessage, messages);

      let finalResponse = chatResponse;
      if (language === "es") {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chatResponse, targetLanguage: "es" }),
        });
        const data = await response.json();
        if (data.translatedText) {
          finalResponse = data.translatedText;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: finalResponse,
          id: Date.now().toString(),
        },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage =
        language === "es"
          ? "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo."
          : "Sorry, there was an error processing your message. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage, id: Date.now().toString() },
      ]);
    } finally {
      setIsLoading(false);
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
              className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300"
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
              className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h2 className="font-semibold">
                  {language === "es"
                    ? "Asistente de Compras"
                    : "Shopping Assistant"}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/20 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
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
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        message.role === "assistant"
                          ? "bg-gray-100 dark:bg-gray-800/50 shadow-sm"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                      }`}
                    >
                      <ReactMarkdown className="whitespace-pre-wrap prose dark:prose-invert max-w-none prose-sm">
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
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
                        {language === "es" ? "Escribiendo..." : "Typing..."}
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
                  placeholder={
                    language === "es"
                      ? "Escribe tu mensaje..."
                      : "Type your message..."
                  }
                  disabled={isLoading}
                  className="border-purple-500/20 focus:border-purple-500 text-sm rounded-xl bg-background/50"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 rounded-xl px-4 shadow-lg hover:shadow-purple-500/20"
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
