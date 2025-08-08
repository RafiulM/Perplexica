# Perplexica Project Requirements Document (PRD)

## 1. Project Overview

Perplexica is an open-source, AI-powered search engine inspired by Perplexity AI. Its goal is to give users fast, concise, and reliable answers to their natural-language queries by combining smart web‐search agents, large language models (LLMs), and embedding models. Behind the scenes, Perplexica rephrases your question, runs a targeted search, synthesizes the best information, and returns a clear answer complete with source citations.

We’re building Perplexica to solve the problem of information overload on the web. Instead of wading through dozens of links, users get an on‐point summary with references. Our key objectives for version 1 are: (1) accurate, cited AI responses; (2) a smooth real‐time experience via streaming; (3) flexible search strategies ("focus modes"); and (4) support for multiple LLM and embedding providers. Success means sub‐second query routing, clear answers with links, and a stable chat history stored locally.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1)**
- Web‐based chat interface built with Next.js and Tailwind CSS
- Natural‐language query input and real‐time streaming of AI answers via WebSockets
- Source citations for every answer (pulled from SearxNG search results)
- Multiple "focus modes" (e.g., general web search, academic search) handled by distinct agents
- Configuration panel to select LLM providers (OpenAI, Anthropic, Groq, Ollama) and embedding models (Xenova/transformers)
- Persistent chat history stored in SQLite via Drizzle ORM
- Docker and docker-compose setup for both frontend and backend
- Basic settings page for user API keys, model selection, and focus mode defaults

**Out-of-Scope (Later Phases)**
- User authentication or multi‐user accounts
- Collaboration features (sharing or exporting chats)
- Advanced analytics or usage dashboards
- Mobile app or native desktop client
- Complex subscription or payment integration
- Enterprise‐grade scaling (e.g., distributed database, Kubernetes)
- Automated testing (unit, integration, end‐to‐end)

## 3. User Flow

When a new visitor lands on the Perplexica web app, they see a clean search/chat screen. At the top is a query input box, alongside a dropdown for selecting the focus mode (e.g., "Web Search" or "Academic"). Below, the chat history area shows past questions and answers. On the side or in a settings panel, users can input API keys and choose preferred LLM or embedding providers.

A user types a question, selects a focus mode, and hits Enter. The frontend opens a WebSocket connection to the Node.js server. As the AI model generates text, each token streams back to the browser and appears in real time, along with inline citations. Once the answer is complete, it’s saved to the SQLite database. The user can scroll through previous exchanges, tweak their models or modes in settings, and then ask the next question—all without reloading the page.

## 4. Core Features

- **Natural-Language Query Input**: Single-line input accepts any user question.
- **Real-Time Streaming**: WebSocket-based token streaming from server to client for low-latency answer rendering.
- **Source Citations**: Each answer includes clickable links back to original search results aggregated by SearxNG.
- **Focus Modes**: Strategy pattern supporting multiple search workflows (e.g., `webSearchAgent`, `academicSearchAgent`).
- **LLM Provider Switch**: UI and backend support for OpenAI, Anthropic, Groq, Ollama chat models.
- **Embedding Models**: Integration with Xenova/transformers for semantic operations.
- **Chat History Persistence**: Save and retrieve past conversations in SQLite using Drizzle ORM.
- **Configuration Panel**: Settings UI for API keys, default models, focus modes stored in `config.toml` and environment variables.
- **Dockerized Deployment**: `Dockerfile`s and `docker-compose.yaml` to spin up frontend, backend, and SearxNG service.

## 5. Tech Stack & Tools

- **Frontend**
  - Next.js (React) for SSR/SSG and dynamic routing
  - Tailwind CSS for utility‐first styling
  - WebSockets (native browser API) for streaming updates
- **Backend**
  - Node.js with TypeScript
  - Express.js for HTTP and WebSocket server setup
  - Langchain for LLM orchestration and prompt chaining
  - SearxNG as an external search aggregator
  - Drizzle ORM + SQLite for chat history storage
  - Xenova/transformers for local embeddings
- **AI Models & Libraries**
  - OpenAI, Anthropic, Groq, Ollama REST APIs
  - Langchain `RunnableSequence`, `PromptTemplate`
- **Containerization**
  - Docker & docker-compose for environment consistency
- **Developer Tools**
  - VS Code or any TypeScript‐friendly IDE
  - Prettier/ESLint for code formatting and linting

## 6. Non-Functional Requirements

- **Performance**: <200 ms server routing time; streaming latency <100 ms per token.
- **Scalability**: Single‐instance capable of 20 concurrent users; future horizontal scaling via docker-compose.
- **Security**: API keys only in environment variables or `config.toml`; input validation on queries; CORS restricted to approved domains.
- **Reliability**: Automatic reconnection logic for WebSockets; graceful error messages on model/API failures.
- **Usability**: Intuitive UI with responsive design for desktop and tablet.
- **Compliance**: Adhere to GDPR-style privacy—no personal data collection beyond query text.

## 7. Constraints & Assumptions

- Must have access to at least one supported LLM API (OpenAI, Anthropic, etc.) or local Ollama endpoint.
- SearxNG instance is available and configured in `docker-compose.yaml`.
- SQLite is sufficient for initial history storage (no heavy write load).
- Users will supply valid API keys in settings before invoking models.
- Hosting environment supports Docker and modern Node.js runtimes.

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits**: External LLM providers enforce rate limits—implement exponential backoff and retries.
- **Prompt Injection**: Sanitization on user input to avoid malicious prompts; log suspicious activity.
- **WebSocket Drift**: Clients may drop connections—add keep-alive heartbeats and auto-reconnect.
- **SQLite Locking**: Concurrent writes could block—ensure serialized access or consider migrating to PostgreSQL later.
- **Configuration Drift**: Mixing `config.toml` and env vars might lead to confusion—document priority order clearly.

---

This PRD should serve as the single source of truth for all subsequent technical documents—Tech Stack details, Frontend/Backend guidelines, file structures, and more. Each requirement is spelled out to eliminate ambiguity and guide the AI-powered development workflow toward a successful version 1 launch of Perplexica.