"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { Message } from "@/components/chat/MessageBubble";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { FloatingOrbs } from "@/components/ui/FloatingOrbs";

const STORAGE_KEY = "rag-portfolio-chat-history";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Mark loaded messages to skip animation
          const hydratedMessages = parsed.map((msg: Message) => ({
            ...msg,
            skipAnimation: true
          }));
          setMessages(hydratedMessages);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (isHydrated && messages.length > 0) {
      try {
        // Keep only the last 50 messages to avoid storage limits
        const toStore = messages.slice(-50);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }
  }, [messages, isHydrated]);

  // Function to clear chat history
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);


  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare chat history (last 10 messages for context)
      const history = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call the chat API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      // Stream the response and collect full content
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        let fullContent = "";

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
          }
        }

        // Add the complete message - typewriter will animate it
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          { id: assistantMessageId, role: "assistant", content: fullContent },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"
            }. Please make sure the Gemini API key is configured correctly.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="h-dvh bg-background relative overflow-hidden flex flex-col">
      {/* Floating orbs background */}
      <FloatingOrbs />

      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-50 pointer-events-none" />

      {/* Noise texture */}
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <AnimatedLogo letter="V" />
            <div>
              <h1 className="font-semibold text-lg">Vansh Sharma</h1>
              <p className="text-xs text-muted-foreground">AI Portfolio</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ThemeToggle />
          </motion.div>
        </header>

        {/* Hero section - collapses smoothly when messages exist */}
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20, height: "auto" }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="text-center px-6 py-4 flex-shrink-0 overflow-hidden"
            >
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2"
                layout
              >
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Ask Me Anything
                </span>
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-xl mx-auto text-xs md:text-sm"
                layout
              >
                Chat with my AI assistant to learn about my skills, projects, education,
                and experience. Powered by RAG for accurate, contextual responses.
              </motion.p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Chat container - takes remaining space */}
        <main className="flex-1 px-4 pb-4 min-h-0 overflow-hidden">
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            onSend={handleSendMessage}
            onClear={clearHistory}
          />
        </main>

        {/* Footer - compact */}
        <footer className="py-3 text-center flex-shrink-0 border-t border-border/30">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/80" suppressHydrationWarning>
            {/* Powered by badge */}
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full glass text-[10px]">
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="currentColor"
              >
                <path d="M12 0L8 8L0 12L8 16L12 24L16 16L24 12L16 8L12 0Z" />
              </svg>
              Powered by Gemini
            </span>

            <span className="text-muted-foreground/40">•</span>

            {/* GitHub link */}
            <a
              href="https://github.com/vanshsharma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>

            {/* LinkedIn link */}
            <a
              href="https://linkedin.com/in/vanshsharma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
