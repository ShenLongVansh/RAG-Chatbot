"use client";

import { motion } from "framer-motion";

interface ThreeDAvatarProps {
    animate?: boolean;
}

export function ThreeDAvatar({ animate = true }: ThreeDAvatarProps) {
    return (
        <div className="relative w-8 h-8 flex items-center justify-center preserve-3d">
            {/* Outer ring */}
            <motion.div
                className="absolute w-full h-full rounded-full border-2 border-primary/30 border-t-primary border-b-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                animate={animate ? { rotateX: 360, rotateY: 180, rotateZ: 360 } : { rotateX: 0, rotateY: 0, rotateZ: 0 }}
                transition={animate ? { duration: 8, ease: "linear", repeat: Infinity } : { duration: 0 }}
                style={{ transformStyle: "preserve-3d" }}
            />

            {/* Middle ring */}
            <motion.div
                className="absolute w-[70%] h-[70%] rounded-full border border-secondary/50 border-l-secondary border-r-secondary"
                animate={animate ? { rotateX: 180, rotateY: 360, rotateZ: -180 } : { rotateX: 45, rotateY: 45, rotateZ: 0 }}
                transition={animate ? { duration: 6, ease: "linear", repeat: Infinity } : { duration: 0 }}
                style={{ transformStyle: "preserve-3d" }}
            />

            {/* Inner core */}
            <motion.div
                className="absolute w-[30%] h-[30%] bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"
                animate={animate ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={animate ? { duration: 2, ease: "easeInOut", repeat: Infinity } : { duration: 0 }}
            />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/10 blur-md rounded-full" />
        </div>
    );
}
