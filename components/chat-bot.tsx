"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getChatResponse } from "@/lib/gemini";
import { MessageCircle, Minimize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add initial welcome message based on language
      const welcomeMessage =
        language === "es"
          ? "¡Bienvenido a nuestro Asistente de Compras! 👋\n\nPuedo ayudarte con:\n\n1. Productos de Geometría Sagrada\n• Información sobre nuestros Sólidos Platónicos\n• Sus asociaciones elementales\n• Propiedades metafísicas\n• Precios y disponibilidad\n\n2. Remedios Florales de Bach\n• Información sobre cada esencia\n• Beneficios emocionales\n• Recomendaciones personalizadas\n\n¿En qué puedo ayudarte hoy?"
          : "Welcome to Our Shopping Assistant! 👋\n\nI can help you with:\n\n1. Sacred Geometry Products\n• Information about our Platonic Solids\n• Their elemental associations\n• Metaphysical properties\n• Pricing and availability\n\n2. Bach Flower Remedies\n• Information about each essence\n• Emotional benefits\n• Personalized recommendations\n\nHow can I assist you today?";

      setMessages([{ role: "assistant", content: welcomeMessage }]);
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
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // First translate user message to English if in Spanish
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

      // Get response from chatbot
      const chatResponse = await getChatResponse(processedMessage, messages);

      // Translate response back to Spanish if needed
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
        { role: "assistant", content: finalResponse },
      ]);
    } catch (error) {
      console.error("Error in chat:", error);
      const errorMessage =
        language === "es"
          ? "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo."
          : "Sorry, there was an error processing your message. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] sm:w-[350px] md:w-96 h-[500px] sm:h-[600px] shadow-xl flex flex-col bg-background/80 backdrop-blur-sm border border-purple-500/20 animate-in slide-in-from-right duration-300">
      <div className="p-3 sm:p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <h2 className="font-semibold text-sm sm:text-base">
          {language === "es" ? "Asistente de Compras" : "Shopping Assistant"}
        </h2>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-9 sm:w-9 hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-9 sm:w-9 hover:bg-white/20"
            onClick={() => {
              setIsOpen(false);
              setMessages([]);
            }}
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[85%] p-2 sm:p-3 rounded-lg text-sm ${
                message.role === "assistant"
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-purple-600 text-white"
              }`}
            >
              <ReactMarkdown className="whitespace-pre-wrap text-xs sm:text-sm prose dark:prose-invert max-w-none prose-sm">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-2 sm:p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <p className="text-xs sm:text-sm">
                {language === "es" ? "Escribiendo..." : "Typing..."}
              </p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t bg-background/80 backdrop-blur-sm"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === "es"
                ? "Escribe tu mensaje..."
                : "Type your message..."
            }
            disabled={isLoading}
            className="border-purple-500/20 focus:border-purple-500 text-sm"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 px-3 sm:px-4"
          >
            {language === "es" ? "Enviar" : "Send"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
