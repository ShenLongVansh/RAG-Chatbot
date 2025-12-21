"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 px-4 py-2"
        >
            {/* AI Avatar */}
            <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium glass border border-border">
                AI
            </div>

            {/* Typing bubble */}
            <div className="flex items-center gap-2 glass rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <motion.span
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                </div>
                <span className="text-sm text-muted-foreground ml-1">Thinking...</span>
            </div>
        </motion.div>
    );
}
