"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuggestionPanelProps {
    onSend: (message: string) => void;
    visible: boolean;
}

const SUGGESTIONS = [
    { emoji: "🛠️", text: "Skills", color: "from-blue-500 to-cyan-500", bubbleColor: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)", isDownload: false },
    { emoji: "💼", text: "Experience", color: "from-purple-500 to-pink-500", bubbleColor: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)", isDownload: false },
    { emoji: "📱", text: "Projects", color: "from-green-500 to-emerald-500", bubbleColor: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)", isDownload: false },
    { emoji: "🎓", text: "Education", color: "from-orange-500 to-yellow-500", bubbleColor: "linear-gradient(135deg, #f97316 0%, #eab308 100%)", isDownload: false },
    { emoji: "📄", text: "Resume", color: "from-rose-500 to-red-500", bubbleColor: "linear-gradient(135deg, #f43f5e 0%, #ef4444 100%)", isDownload: true },
];

const FULL_QUESTIONS: Record<string, string> = {
    "Skills": "What are Vansh's skills?",
    "Experience": "Tell me about his experience",
    "Projects": "What projects has he built?",
    "Education": "What's his education?",
};

export function SuggestionPanel({ onSend, visible }: SuggestionPanelProps) {
    const [mounted, setMounted] = useState(false);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({});

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

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

        // After bubble animation - either download resume or send chat message
        setTimeout(() => {
            if (suggestion.isDownload) {
                // Handle resume download
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Vansh_Sharma_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Send chat message
                onSend(FULL_QUESTIONS[suggestion.text]);
            }
            setClickedIndex(null);
        }, 700);
    };

    return (
        <>
            <AnimatePresence>
                {visible && mounted && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.25 }}
                        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2 z-20"
                    >
                        {SUGGESTIONS.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.text}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.15 }}
                                whileHover={{
                                    scale: 1.08,
                                    x: -8,
                                    rotateY: -5,
                                    transition: { duration: 0.1 }
                                }}
                                whileTap={{ scale: 0.92, transition: { duration: 0.05 } }}
                                onClick={(e) => handleClick(suggestion, index, e)}
                                className="group relative px-3 py-2 text-xs rounded-xl glass border border-border overflow-hidden transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap hover:border-transparent"
                                style={{
                                    transformStyle: "preserve-3d",
                                    perspective: "500px",
                                }}
                            >
                                {/* Hover background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${suggestion.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                {/* Content */}
                                <span className="relative z-10 text-sm group-hover:text-white transition-colors duration-300">{suggestion.emoji}</span>
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">{suggestion.text}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble transition overlay */}
            <AnimatePresence>
                {clickedIndex !== null && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                scale: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.3 }
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
                            transition={{ delay: 0.15, duration: 0.3 }}
                            className="fixed inset-0 flex items-center justify-center pointer-events-none"
                            style={{ zIndex: 9999 }}
                        >
                            <div className="flex items-center gap-3 text-white">
                                <span className="text-3xl">{SUGGESTIONS[clickedIndex]?.emoji}</span>
                                <span className="text-xl font-medium">{SUGGESTIONS[clickedIndex]?.text}</span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
