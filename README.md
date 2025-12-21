# AI Portfolio RAG – Premium UI

A premium AI portfolio web application that lets users chat with an AI assistant powered by Gemini and RAG (Retrieval Augmented Generation).

![AI Portfolio Chat](https://rag-chatbot-smoky.vercel.app/)

## ✨ Features

- **Premium UI** – Glassmorphism styling, smooth animations, dark/light themes
- **RAG-Powered Chat** – AI answers based on your personal profile data
- **Streaming Responses** – Real-time typing effect for AI responses
- **Fully Responsive** – Works on desktop and mobile
- **Easy to Customize** – Update your info in a single JSON file

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gemini API

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 3. Customize Your Profile

Edit `lib/data/profile.json` with your personal information:
- Name, bio, and location
- Education and achievements
- Skills and tech stack
- Projects and experience
- Social links

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
├── app/
│   ├── api/chat/route.ts    # Chat API with RAG integration
│   ├── globals.css          # Premium styling & animations
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main chat page
├── components/
│   ├── chat/                # Chat components
│   │   ├── ChatContainer.tsx
│   │   ├── ChatInput.tsx
│   │   ├── CopyButton.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageList.tsx
│   │   └── TypingIndicator.tsx
│   ├── ui/                  # shadcn/ui components
│   ├── RippleButton.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
└── lib/
    ├── data/profile.json    # Your personal data
    └── rag/                 # RAG utilities
        ├── documents.ts
        ├── embeddings.ts
        ├── retrieval.ts
        └── vectorStore.ts
```

## 🛠️ Tech Stack

- **Next.js 14** – App Router with TypeScript
- **Tailwind CSS v4** – Modern styling
- **shadcn/ui** – Premium components
- **Framer Motion** – Smooth animations
- **Gemini API** – AI responses and embeddings
- **In-memory Vector Store** – Lightweight RAG

## 📝 How RAG Works

1. Your profile data is chunked and embedded using Gemini
2. When a user asks a question, we embed their query
3. We find the most relevant chunks using cosine similarity
4. The relevant context is included in the prompt to Gemini
5. Gemini generates a response grounded in your actual data

## 📄 License

MIT License – feel free to use and modify for your own portfolio!
