"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [circleStyle, setCircleStyle] = useState<React.CSSProperties>({});
    const [pendingTheme, setPendingTheme] = useState<string | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isAnimating) return;

        const newTheme = resolvedTheme === "dark" ? "light" : "dark";

        // Get button position for the animation origin
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) {
            setTheme(newTheme);
            return;
        }

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Calculate the maximum radius needed to cover the entire screen
        const maxX = Math.max(x, window.innerWidth - x);
        const maxY = Math.max(y, window.innerHeight - y);
        const endRadius = Math.sqrt(maxX * maxX + maxY * maxY) * 2;

        // Set the circle position and start animation
        setCircleStyle({
            left: x,
            top: y,
            width: endRadius * 2,
            height: endRadius * 2,
            marginLeft: -endRadius,
            marginTop: -endRadius,
            backgroundColor: newTheme === "dark" ? "#1a1625" : "#fafafa",
        });

        setPendingTheme(newTheme);
        setIsAnimating(true);
    };

    // Apply theme early in animation
    useEffect(() => {
        if (isAnimating && pendingTheme) {
            const timer = setTimeout(() => {
                setTheme(pendingTheme);
            }, 300); // Apply theme early

            return () => clearTimeout(timer);
        }
    }, [isAnimating, pendingTheme, setTheme]);

    // End animation - stay visible longer so UI fully renders behind
    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setPendingTheme(null);
            }, 1100); // Wait until theme is fully rendered

            return () => clearTimeout(timer);
        }
    }, [isAnimating]);

    if (!mounted) {
        return (
            <div className="h-10 w-10 rounded-xl glass" />
        );
    }

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleTheme}
                disabled={isAnimating}
                className="relative h-10 w-10 rounded-xl glass hover-glow transition-all duration-300 flex items-center justify-center text-foreground/80 hover:text-foreground overflow-hidden z-50"
                aria-label="Toggle theme"
            >
                <AnimatePresence mode="wait">
                    {resolvedTheme === "dark" ? (
                        <motion.svg
                            key="sun"
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="moon"
                            initial={{ scale: 0, rotate: 90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </button>

            {/* Circular transition overlay with centered text */}
            <AnimatePresence>
                {isAnimating && (
                    <>
                        {/* Background circle - expands from button */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                scale: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.15 }
                            }}
                            className="fixed rounded-full pointer-events-none"
                            style={{
                                ...circleStyle,
                                zIndex: 9998,
                            }}
                        />

                        {/* Centered text label - fades out first */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.1, // Fast exit
                                opacity: { duration: 0.2, delay: 0.2 },
                                scale: { duration: 0.3, delay: 0.2 },
                            }}
                            className="fixed inset-0 flex items-center justify-center pointer-events-none"
                            style={{ zIndex: 9999 }}
                        >
                            <div className="flex flex-col items-center gap-4">
                                {/* Icon */}
                                {pendingTheme === "dark" ? (
                                    <motion.svg
                                        initial={{ rotate: -30 }}
                                        animate={{ rotate: 0 }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                    </motion.svg>
                                ) : (
                                    <motion.svg
                                        initial={{ rotate: 30, scale: 0.8 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#1a1625"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="4" />
                                        <path d="M12 2v2" />
                                        <path d="M12 20v2" />
                                        <path d="m4.93 4.93 1.41 1.41" />
                                        <path d="m17.66 17.66 1.41 1.41" />
                                        <path d="M2 12h2" />
                                        <path d="M20 12h2" />
                                        <path d="m6.34 17.66-1.41 1.41" />
                                        <path d="m19.07 4.93-1.41 1.41" />
                                    </motion.svg>
                                )}

                                {/* Text */}
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: 0.2 }}
                                    className="text-2xl font-semibold tracking-wide"
                                    style={{
                                        color: pendingTheme === "dark" ? "white" : "#1a1625"
                                    }}
                                >
                                    {pendingTheme === "dark" ? "Dark Mode" : "Light Mode"}
                                </motion.span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
