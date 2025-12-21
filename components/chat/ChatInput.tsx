"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { RippleButton } from "@/components/RippleButton";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSend = useCallback(() => {
        const trimmed = input.trim();
        if (trimmed && !disabled) {
            onSend(trimmed);
            setInput("");
        }
    }, [input, onSend, disabled]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-3 md:p-4 border-t border-border/50"
        >
            <div className="glass rounded-xl md:rounded-2xl p-1.5 md:p-2 flex items-end gap-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300" suppressHydrationWarning>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                        // Scroll into view when keyboard opens on mobile
                        setTimeout(() => {
                            e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 300);
                    }}
                    placeholder="Ask me anything..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-transparent border-none outline-none resize-none px-2 md:px-3 py-2 text-sm md:text-base placeholder:text-muted-foreground/60 max-h-32 scrollbar-none"
                    style={{
                        height: "auto",
                        minHeight: "36px",
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = Math.min(target.scrollHeight, 128) + "px";
                    }}
                />

                <RippleButton
                    onClick={handleSend}
                    disabled={disabled || !input.trim()}
                    className={`h-9 w-9 md:h-10 md:w-10 flex-shrink-0 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 ${input.trim() && !disabled
                        ? "bg-primary text-primary-foreground glow-sm"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                >
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={input.trim() && !disabled ? {
                            x: [0, 2, 0],
                        } : {}}
                        transition={{ duration: 0.5, repeat: input.trim() && !disabled ? Infinity : 0, repeatDelay: 1 }}
                    >
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                    </motion.svg>
                </RippleButton>
            </div>

            {/* Hide on mobile, show on larger screens */}
            <p className="hidden md:block text-xs text-muted-foreground/60 text-center mt-2">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">Shift+Enter</kbd> for new line
            </p>
        </motion.div>
    );
}
