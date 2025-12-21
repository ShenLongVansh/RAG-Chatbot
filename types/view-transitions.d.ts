// Type declarations for View Transitions API
interface ViewTransition {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition(): void;
}

interface Document {
    startViewTransition?(callback: () => Promise<void> | void): ViewTransition;
}
