"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { Message } from "./MessageBubble";
import { SuggestionPanel } from "./SuggestionPanel";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface ChatContainerProps {
    messages: Message[];
    isLoading: boolean;
    onSend: (message: string) => void;
    onClear?: () => void;
}

export function ChatContainer({
    messages,
    isLoading,
    onSend,
    onClear,
}: ChatContainerProps) {
    const [showClearModal, setShowClearModal] = useState(false);

    const handleClearClick = () => {
        setShowClearModal(true);
    };

    const handleConfirmClear = () => {
        if (onClear) {
            onClear();
        }
        setShowClearModal(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full max-w-3xl mx-auto h-full"
            >
                <div className="glass-strong rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl" suppressHydrationWarning>
                    {/* Header - fixed height */}
                    <div className="flex-shrink-0 px-6 py-3 border-b border-border/50" suppressHydrationWarning>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
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
                            </div>
                            <div>
                                <h2 className="font-semibold text-sm">AI Assistant</h2>
                                <p className="text-xs text-muted-foreground">
                                    Powered by RAG + Gemini
                                </p>
                            </div>
                            <div className="ml-auto flex items-center gap-3">
                                {messages.length > 0 && onClear && (
                                    <button
                                        onClick={handleClearClick}
                                        className="flex items-center gap-1.5 text-xs text-red-500/80 hover:text-white hover:bg-red-600 transition-all duration-200 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-600 shadow-sm cursor-pointer"
                                        title="Clear chat history"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                        Clear
                                    </button>
                                )}
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <span className={`h-2 w-2 rounded-full animate-pulse ${isLoading ? 'bg-amber-500' : 'bg-green-500'}`} />
                                    {isLoading ? 'Thinking...' : 'Online'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Messages - scrollable, takes remaining space */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <MessageList messages={messages} isLoading={isLoading} onSendSuggestion={onSend} />
                    </div>

                    {/* Input - fixed at bottom */}
                    <div className="flex-shrink-0">
                        <ChatInput onSend={onSend} disabled={isLoading} />
                    </div>
                </div>

                {/* Floating suggestion panel on the right */}
                <SuggestionPanel onSend={onSend} visible={messages.length > 0} />
            </motion.div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showClearModal}
                title="Clear Chat History"
                message="Are you sure you want to delete all messages? This action cannot be undone."
                confirmText="Clear All"
                cancelText="Cancel"
                onConfirm={handleConfirmClear}
                onCancel={() => setShowClearModal(false)}
            />
        </>
    );
}
