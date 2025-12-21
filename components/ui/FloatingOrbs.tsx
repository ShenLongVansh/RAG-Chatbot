"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function FloatingOrbs() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Parallax transforms - different depths for different orbs
    const moveX1 = useTransform(springX, [0, 1], [-20, 20]);
    const moveY1 = useTransform(springY, [0, 1], [-20, 20]);

    const moveX2 = useTransform(springX, [0, 1], [30, -30]); // Inverse direction
    const moveY2 = useTransform(springY, [0, 1], [30, -30]);

    const moveX3 = useTransform(springX, [0, 1], [-10, 10]);
    const moveY3 = useTransform(springY, [0, 1], [-10, 10]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse position from -1 to 1
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth) * 2 - 1;
            const y = (e.clientY / innerHeight) * 2 - 1;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Primary orb - Background layer */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full opacity-30"
                style={{
                    background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    willChange: "transform",
                    x: moveX1,
                    y: moveY1,
                }}
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Secondary orb - Middle layer */}
            <motion.div
                className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full opacity-20"
                style={{
                    background: "radial-gradient(circle, oklch(0.6 0.2 200) 0%, transparent 70%)",
                    filter: "blur(35px)",
                    willChange: "transform",
                    x: moveX2,
                    y: moveY2,
                }}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Accent orb - Foreground layer */}
            <motion.div
                className="absolute left-1/2 top-1/2 w-[300px] h-[300px] rounded-full opacity-15"
                style={{
                    background: "radial-gradient(circle, oklch(0.5 0.25 320) 0%, transparent 70%)",
                    filter: "blur(25px)",
                    willChange: "transform",
                    transform: "translate(-50%, -50%)",
                    x: moveX3,
                    y: moveY3,
                }}
                animate={{
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
