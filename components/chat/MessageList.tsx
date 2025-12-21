"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageBubble, Message } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    onSendSuggestion?: (message: string) => void;
}

const SUGGESTIONS = [
    { emoji: "🛠️", text: "What are Vansh's skills?", label: "Skills", color: "from-blue-500 to-cyan-500", bubbleColor: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)" },
    { emoji: "💼", text: "Tell me about his experience", label: "Experience", color: "from-purple-500 to-pink-500", bubbleColor: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
    { emoji: "📱", text: "What projects has he built?", label: "Projects", color: "from-green-500 to-emerald-500", bubbleColor: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)" },
    { emoji: "🎓", text: "What's his education?", label: "Education", color: "from-orange-500 to-yellow-500", bubbleColor: "linear-gradient(135deg, #f97316 0%, #eab308 100%)" },
];

export function MessageList({ messages, isLoading, onSendSuggestion }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({});

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleClick = (suggestion: typeof SUGGESTIONS[0], index: number, event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const maxX = Math.max(x, window.innerWidth - x);
        const maxY = Math.max(y, window.innerHeight - y);
        const endRadius = Math.sqrt(maxX * maxX + maxY * maxY) * 2;

        setBubbleStyle({
            left: x,
            top: y,
            width: endRadius * 2,
            height: endRadius * 2,
            marginLeft: -endRadius,
            marginTop: -endRadius,
            background: suggestion.bubbleColor,
        });

        setClickedIndex(index);

        setTimeout(() => {
            onSendSuggestion?.(suggestion.text);
            setClickedIndex(null);
        }, 400);
    };

    return (
        <>
            <div className="h-full overflow-y-auto scrollbar-none md:scrollbar-thin md:scrollbar-thumb-border md:scrollbar-track-transparent" suppressHydrationWarning>
                <div ref={scrollRef} className="py-4 space-y-4 min-h-full" suppressHydrationWarning>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[250px] text-center px-4" suppressHydrationWarning>
                            <motion.div
                                className="glass rounded-3xl p-6 md:p-8 max-w-md"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Floating animated robot icon */}
                                <motion.div
                                    className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M12 8V4H8" />
                                        <rect width="16" height="12" x="4" y="8" rx="2" />
                                        <path d="M2 14h2" />
                                        <path d="M20 14h2" />
                                        <path d="M15 13v2" />
                                        <path d="M9 13v2" />
                                    </svg>
                                </motion.div>

                                <h3 className="text-xl font-semibold mb-2">
                                    Hi! I&apos;m an AI assistant
                                </h3>
                                <p className="text-muted-foreground text-sm mb-6">
                                    Ask me anything about Vansh&apos;s portfolio. Try these:
                                </p>

                                {/* Suggestion chips with bubble animation */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {SUGGESTIONS.map((suggestion, index) => (
                                        <motion.button
                                            key={suggestion.text}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                                            whileHover={{
                                                scale: 1.08,
                                                y: -3,
                                                rotateX: 5,
                                                transition: { duration: 0.1 }
                                            }}
                                            whileTap={{ scale: 0.92, transition: { duration: 0.05 } }}
                                            onClick={(e) => handleClick(suggestion, index, e)}
                                            className="group relative px-3 py-2 text-xs md:text-sm rounded-full glass border border-border overflow-hidden transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:border-transparent"
                                            style={{
                                                transformStyle: "preserve-3d",
                                                perspective: "500px",
                                            }}
                                        >
                                            {/* Hover background gradient */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${suggestion.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                            <span className="relative z-10 group-hover:text-white transition-colors duration-300">{suggestion.emoji}</span>
                                            <span className="relative z-10 hidden md:inline group-hover:text-white transition-colors duration-300">{suggestion.text}</span>
                                            <span className="relative z-10 md:hidden group-hover:text-white transition-colors duration-300">{suggestion.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {messages.map((message, index) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    index={index}
                                    isLatest={index === messages.length - 1}
                                    isTyping={isLoading}
                                    onType={() => bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" })}
                                />
                            ))}
                        </AnimatePresence>
                    )}

                    {/* Typing indicator */}
                    <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

                    {/* Scroll anchor */}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Bubble transition overlay */}
            <AnimatePresence>
                {clickedIndex !== null && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                scale: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.2 }
                            }}
                            className="fixed rounded-full pointer-events-none"
                            style={{
                                ...bubbleStyle,
                                zIndex: 9998,
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                            className="fixed inset-0 flex items-center justify-center pointer-events-none"
                            style={{ zIndex: 9999 }}
                        >
                            <div className="flex items-center gap-3 text-white">
                                <span className="text-3xl">{SUGGESTIONS[clickedIndex]?.emoji}</span>
                                <span className="text-xl font-medium">{SUGGESTIONS[clickedIndex]?.label}</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
