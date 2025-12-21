"use client";

import { motion } from "framer-motion";

interface AnimatedLogoProps {
    letter?: string;
    className?: string;
}

export function AnimatedLogo({ letter = "V", className = "" }: AnimatedLogoProps) {
    return (
        <motion.div
            className={`relative h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden ${className}`}
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
            style={{
                transformStyle: "preserve-3d",
                perspective: "500px",
            }}
        >
            {/* Animated gradient background */}
            <motion.div
                className="absolute inset-0 opacity-50"
                animate={{
                    background: [
                        "linear-gradient(45deg, var(--primary) 0%, transparent 50%)",
                        "linear-gradient(135deg, var(--primary) 0%, transparent 50%)",
                        "linear-gradient(225deg, var(--primary) 0%, transparent 50%)",
                        "linear-gradient(315deg, var(--primary) 0%, transparent 50%)",
                        "linear-gradient(45deg, var(--primary) 0%, transparent 50%)",
                    ],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Glow ring */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                    boxShadow: [
                        "0 0 10px var(--glow), inset 0 0 10px transparent",
                        "0 0 20px var(--glow), inset 0 0 15px var(--glow)",
                        "0 0 10px var(--glow), inset 0 0 10px transparent",
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Letter with 3D effect */}
            <motion.span
                className="relative z-10 text-primary font-bold text-lg"
                animate={{
                    textShadow: [
                        "0 0 10px var(--glow)",
                        "0 0 20px var(--glow)",
                        "0 0 10px var(--glow)",
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                whileHover={{
                    scale: 1.2,
                    rotateY: 15,
                    transition: { duration: 0.15 }
                }}
            >
                {letter}
            </motion.span>

            {/* Subtle particle effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-primary/40"
                        initial={{
                            x: "50%",
                            y: "100%",
                            opacity: 0,
                        }}
                        animate={{
                            y: [40, -10],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.6,
                            ease: "easeOut",
                        }}
                        style={{
                            left: `${30 + i * 20}%`,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
