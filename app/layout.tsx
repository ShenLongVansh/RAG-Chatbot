import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vansh Sharma | AI Portfolio",
  description:
    "Chat with an AI assistant to learn about Vansh Sharma's skills, projects, and experience. Powered by RAG and Gemini.",
  keywords: [
    "Vansh Sharma",
    "Portfolio",
    "Full Stack Developer",
    "AI",
    "RAG",
    "Next.js",
  ],
  authors: [{ name: "Vansh Sharma" }],
  openGraph: {
    title: "Vansh Sharma | AI Portfolio",
    description:
      "Chat with an AI assistant to learn about Vansh Sharma's skills, projects, and experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
