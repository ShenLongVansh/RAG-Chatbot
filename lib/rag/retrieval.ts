import { getVectorStore } from "./vectorStore";
import { DocumentChunk } from "./documents";

/**
 * Retrieve relevant context for a query
 */
export async function retrieveContext(
    query: string,
    topK: number = 5
): Promise<{ chunks: DocumentChunk[]; context: string }> {
    const vectorStore = getVectorStore();
    const chunks = await vectorStore.search(query, topK);

    // Build context string from retrieved chunks
    const context = chunks
        .map((chunk, i) => `[${i + 1}] ${chunk.content}`)
        .join("\n\n");

    return { chunks, context };
}

/**
 * Build the system prompt with retrieved context
 */
export function buildSystemPrompt(context: string): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `You are an AI assistant for Vansh Sharma's portfolio website. Your role is to answer questions about Vansh's skills, experience, education, and projects.

TODAY'S DATE: ${currentDate}

IMPORTANT RULES:
1. ONLY answer based on the context provided below. Do not make up information.
2. If the context doesn't contain relevant information to answer the question, politely say that you don't have that specific information and suggest what questions you CAN answer about Vansh.
3. Be conversational, friendly, and professional.
4. Keep responses concise but informative.
5. Use the provided context to give accurate answers.
6. If asked about topics unrelated to Vansh's portfolio (like weather, current events, etc.), politely redirect the conversation back to Vansh's profile.
7. Use today's date to correctly interpret time-sensitive information (e.g., if a graduation date has passed, Vansh has graduated).

CONTEXT FROM VANSH'S PORTFOLIO:
${context}

Remember: Only use the information from the context above. If something isn't in the context, acknowledge that you don't have that information.`;
}
