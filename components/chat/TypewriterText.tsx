"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface TypewriterTextProps {
    content: string;
    speed?: number;
    onType?: () => void;
}

const markdownComponents = {
    p: ({ children }: any) => (
        <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
    ),
    strong: ({ children }: any) => (
        <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => (
        <em className="italic text-muted-foreground">{children}</em>
    ),
    ul: ({ children }: any) => (
        <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }: any) => (
        <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }: any) => (
        <li className="leading-relaxed">{children}</li>
    ),
    code: ({ children }: any) => (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ),
    pre: ({ children }: any) => (
        <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-2">{children}</pre>
    ),
    a: ({ href, children }: any) => (
        <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
};

export function TypewriterText({ content, speed = 10, onType }: TypewriterTextProps) {
    const [displayedContent, setDisplayedContent] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Reset when content changes
        setDisplayedContent("");
        setCurrentIndex(0);
    }, [content]);

    useEffect(() => {
        if (currentIndex < content.length) {
            const timeout = setTimeout(() => {
                const nextChar = content[currentIndex];
                setCurrentIndex((prev) => prev + 1);

                // Construct new displayed content with auto-closing tags
                const nextContent = content.slice(0, currentIndex + 1);
                const autoClosedContent = autoCloseTags(nextContent);

                setDisplayedContent(autoClosedContent);

                if (onType) {
                    onType();
                }
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, content, speed, onType]);

    // Helper to auto-close markdown tags to prevent flickering
    const autoCloseTags = (text: string): string => {
        // Check for unclosed bold (** or __)
        const boldMatches = text.match(/\*\*/g) || [];
        const isBoldOpen = boldMatches.length % 2 !== 0;

        // Check for unclosed italic (*) - overly simple, might clash with bold but works for basic cases
        // A robust parser is complex, but checking for single * that isn't part of ** is tricky with regex alone.
        // Let's stick to Bold (**) and Code (`) which are most annoying when flickering.

        const codeMatches = text.match(/`/g) || [];
        const isCodeOpen = codeMatches.length % 2 !== 0;

        let result = text;
        if (isBoldOpen) result += "**";
        if (isCodeOpen) result += "`";

        return result;
    };

    return (
        <div className="prose prose-sm md:prose-base prose-invert max-w-none">
            <ReactMarkdown
                components={markdownComponents}
            >
                {displayedContent}
            </ReactMarkdown>
        </div>
    );
}
