import { DocumentChunk, getDocumentChunks } from "./documents";
import { generateEmbedding, cosineSimilarity } from "./embeddings";

interface VectorEntry {
    chunk: DocumentChunk;
    embedding: number[];
}

/**
 * Simple in-memory vector store for document embeddings
 */
class VectorStore {
    private vectors: VectorEntry[] = [];
    private initialized = false;
    private initPromise: Promise<void> | null = null;

    /**
     * Initialize the vector store with document embeddings
     */
    async initialize(): Promise<void> {
        // Prevent multiple initializations
        if (this.initPromise) {
            return this.initPromise;
        }

        if (this.initialized) {
            return;
        }

        this.initPromise = this._doInitialize();
        return this.initPromise;
    }

    private async _doInitialize(): Promise<void> {
        console.log("[VectorStore] Initializing...");

        const chunks = getDocumentChunks();
        console.log(`[VectorStore] Preparing ${chunks.length} document chunks`);

        // Generate embeddings for all chunks
        for (const chunk of chunks) {
            try {
                const embedding = await generateEmbedding(chunk.content);
                this.vectors.push({ chunk, embedding });
                console.log(`[VectorStore] Embedded: ${chunk.id}`);
            } catch (error) {
                console.error(`[VectorStore] Failed to embed chunk ${chunk.id}:`, error);
            }
        }

        this.initialized = true;
        console.log(`[VectorStore] Initialized with ${this.vectors.length} vectors`);
    }

    /**
     * Search for the most similar documents to a query
     */
    async search(query: string, topK: number = 5): Promise<DocumentChunk[]> {
        if (!this.initialized) {
            await this.initialize();
        }

        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);

        // Calculate similarity scores
        const scored = this.vectors.map((entry) => ({
            chunk: entry.chunk,
            score: cosineSimilarity(queryEmbedding, entry.embedding),
        }));

        // Sort by score descending and take top K
        scored.sort((a, b) => b.score - a.score);

        // Filter out low similarity scores (threshold: 0.3)
        const relevant = scored.filter((s) => s.score > 0.3);

        return relevant.slice(0, topK).map((s) => s.chunk);
    }

    /**
     * Reset the vector store to force re-initialization
     */
    reset(): void {
        this.vectors = [];
        this.initialized = false;
        this.initPromise = null;
        console.log("[VectorStore] Reset. Will re-initialize on next query.");
    }

    /**
     * Get the current status of the vector store
     */
    getStatus(): { initialized: boolean; vectorCount: number } {
        return {
            initialized: this.initialized,
            vectorCount: this.vectors.length,
        };
    }
}

// Singleton instance
let vectorStoreInstance: VectorStore | null = null;

export function getVectorStore(): VectorStore {
    if (!vectorStoreInstance) {
        vectorStoreInstance = new VectorStore();
    }
    return vectorStoreInstance;
}

export function resetVectorStore(): void {
    if (vectorStoreInstance) {
        vectorStoreInstance.reset();
    }
}

export type { VectorStore };
