import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { retrieveContext, buildSystemPrompt } from "@/lib/rag/retrieval";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const { message, history } = await request.json();

        if (!message || typeof message !== "string") {
            return new Response(
                JSON.stringify({ error: "Message is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return new Response(
                JSON.stringify({ error: "Gemini API key not configured" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Retrieve relevant context using RAG
        console.log("[Chat API] Retrieving context for:", message);
        const { context, chunks } = await retrieveContext(message, 5);
        console.log(`[Chat API] Retrieved ${chunks.length} relevant chunks`);

        // Build system prompt with context
        const systemPrompt = buildSystemPrompt(context);

        // Prepare chat history for Gemini
        const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        // Initialize the model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt,
        });

        // Create chat with history
        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 1024,
            },
        });

        // Stream the response
        const result = await chat.sendMessageStream(message);

        // Create a readable stream for the response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error("[Chat API] Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("[Chat API] Error:", error);

        const errorMessage = error instanceof Error ? error.message : "An error occurred";

        // Check for rate limit error
        if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("Too Many Requests")) {
            return new Response(
                JSON.stringify({
                    error: "I'm getting a lot of questions right now! Please wait a moment and try again. 🙏"
                }),
                { status: 429, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                error: errorMessage
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
