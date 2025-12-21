"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { CopyButton } from "./CopyButton";
import { TypewriterText } from "./TypewriterText";
import { ThreeDAvatar } from "../ui/ThreeDAvatar";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    skipAnimation?: boolean;
}

interface MessageBubbleProps {
    message: Message;
    index: number;
    isLatest?: boolean;
    isTyping?: boolean;
    onType?: () => void;
}

export function MessageBubble({ message, index, isLatest = false, isTyping = false, onType }: MessageBubbleProps) {
    const isUser = message.role === "user";
    const shouldTypewrite = !isUser && isLatest && !isTyping && message.content.length > 0 && !message.skipAnimation;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"} px-4`}
        >
            {/* Avatar for AI (left side) */}
            {!isUser && (
                <div className="flex-shrink-0">
                    <ThreeDAvatar animate={isLatest || isTyping} />
                </div>
            )}

            {/* Message bubble */}
            <div className={`group relative max-w-[80%] md:max-w-[70%]`}>

                <div
                    className={`${isUser ? "message-user" : "message-ai"} transition-all duration-300`}
                >
                    {isUser ? (
                        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </div>
                    ) : shouldTypewrite ? (
                        <TypewriterText content={message.content} speed={8} onType={onType} />
                    ) : (
                        <div className="prose prose-sm md:prose-base prose-invert max-w-none">
                            <ReactMarkdown
                                components={{
                                    // Style overrides for markdown elements
                                    p: ({ children }) => (
                                        <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-semibold text-foreground">{children}</strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic text-muted-foreground">{children}</em>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="leading-relaxed">{children}</li>
                                    ),
                                    code: ({ children }) => (
                                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                                    ),
                                    pre: ({ children }) => (
                                        <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2">{children}</pre>
                                    ),
                                    h1: ({ children }) => (
                                        <h1 className="text-lg font-bold mb-2">{children}</h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-base font-bold mb-2">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-sm font-bold mb-1">{children}</h3>
                                    ),
                                    a: ({ href, children }) => (
                                        <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}

                    {/* Copy button for AI messages */}
                    {!isUser && (
                        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <CopyButton text={message.content} />
                        </div>
                    )}
                </div>
            </div>

            {/* Avatar for User (right side) */}
            {isUser && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground">
                    U
                </div>
            )}
        </motion.div>
    );
}
