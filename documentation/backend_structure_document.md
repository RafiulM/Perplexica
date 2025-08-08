# Backend Structure Document

## Backend Architecture

Our backend is built with Node.js and Express.js in TypeScript, organized into clear, modular pieces to keep the code clean and easy to maintain. The main characteristics are:

- **Modular Structure**:  
  • `src/agents/` holds specialized search agents (web, academic, etc.) following a strategy pattern.  
  • `src/websocket/` manages real-time streaming via WebSockets.  
  • `src/routes/` defines REST endpoints for non-streaming tasks.  
  • `src/db/` and Drizzle ORM handle database operations.  
- **Design Patterns**:  
  • Strategy Pattern for selecting and running different search agents (“focus modes”).  
  • Dependency Injection for LLM and embedding providers—easy to add or swap services.  
  • Streaming Architecture using WebSockets so partial AI responses show up immediately in the UI.  
- **Frameworks and Libraries**:  
  • Express.js – lightweight HTTP server and routing.  
  • Langchain – orchestrates LLM calls, prompt management, and tool chaining.  
  • Drizzle ORM – type-safe queries and schema definitions for SQLite.  
- **Scalability & Performance**:  
  • Containerized with Docker and `docker-compose` for consistent environments and horizontal scaling.  
  • Agents are stateless and can run in parallel.  
  • Future-ready to swap SQLite for PostgreSQL or similar without touching agent logic.  
- **Maintainability**:  
  • Clear directory separation of concerns.  
  • TypeScript ensures type safety across modules.  
  • Configuration managed in `config.toml` and environment variables—no hard-coded secrets.

## Database Management

- **Type & System**:  
  • Relational SQL database using SQLite (file-based) for ease of setup.  
- **ORM**: Drizzle ORM provides:  
  • Schema definitions in TypeScript.  
  • Type-safe queries and database migrations.  
- **Data Storage & Access**:  
  • Chat sessions and messages persist in the local `db.sqlite` file under `data/`.  
  • Drizzle generates SQL under the hood; queries are written in TypeScript.  
- **Data Practices**:  
  • Simple migration strategy via Drizzle’s migration tooling.  
  • Backups possible by copying the SQLite file.  
  • All sensitive data (API keys) kept out of the database, in configs or environment variables.

## Database Schema

Human-readable layout:

Session table:
- **session**  
  • `id` – unique identifier  
  • `created_at` – timestamp when session started

Message table:
- **message**  
  • `id` – unique identifier  
  • `session_id` – links to `session.id`  
  • `role` – ‘user’ or ‘assistant’  
  • `content` – full text of the query or response  
  • `created_at` – timestamp of creation

SQL schema (SQLite/PostgreSQL style):

```sql
-- Session table
drop table if exists session;
create table session (
  id           text      primary key,
  created_at   datetime  not null default (datetime('now'))
);

-- Message table
drop table if exists message;
create table message (
  id           text      primary key,
  session_id   text      not null,
  role         text      not null,
  content      text      not null,
  created_at   datetime  not null default (datetime('now')),
  foreign key (session_id) references session(id)
);
```  

## API Design and Endpoints

We use a **REST + WebSocket** hybrid approach:

1. **WebSocket Endpoint** (real-time streaming)  
   • URL: `ws://<host>/ws` or secure `wss://<host>/ws`  
   • Message types:  
     - `query` – send user query and focus mode  
     - `streamEvents` – backend streams partial responses and citations  
     - `historyRequest` – fetch previous chat messages

2. **REST Endpoints** (non-streaming operations)  
   • `GET /api/sessions`  – list all chat sessions  
   • `GET /api/sessions/:id/messages`  – retrieve message history for a session  
   • `GET /api/settings`  – fetch current configuration (LLM providers, focus modes)  
   • `POST /api/settings`  – update config (persisted to `config.toml` or reload in memory)

These endpoints separate fast, ongoing chat flows (WebSockets) from occasional data fetches and updates (REST).

## Hosting Solutions

- **Containerization**:  
  • Docker images for backend and frontend.  
  • `docker-compose.yaml` orchestrates services (backend, frontend, SearxNG).  
- **Deployment Targets**:  
  • Cloud: AWS ECS, GCP Cloud Run, Azure Container Instances  
  • On-prem: Docker hosts, Kubernetes clusters  
- **Benefits**:  
  • **Reliability**: Containers isolate dependencies.  
  • **Scalability**: Spin up multiple instances behind a load balancer.  
  • **Cost-effectiveness**: Pay-as-you-go on cloud; self-hosted options keep costs predictable.

## Infrastructure Components

- **Load Balancer**:  
  • Nginx or cloud provider load balancers distribute WebSocket and HTTP traffic.  
- **Caching**:  
  • Currently, agent results are not cached. Easy future addition of Redis for query result caching.  
- **CDN**:  
  • Next.js static assets and frontend bundles can be served via Vercel or CloudFront.  
- **Search Engine**:  
  • SearxNG runs in its own container, acting as a metasearch proxy.  

Together, these pieces ensure fast routing, potential caching, and global delivery of UI assets.

## Security Measures

- **Encryption**:  
  • HTTPS/WSS enforced via TLS certificates (Let’s Encrypt or managed by cloud provider).  
- **Secrets Management**:  
  • API keys and database credentials stored in environment variables and `config.toml` (excluded from source control).  
- **Input Validation**:  
  • Sanitize incoming queries to prevent injection or prompt-injection attacks.  
  • Use libraries like `express-validator` or built-in checks.  
- **HTTP Hardening**:  
  • Helmet middleware to set secure HTTP headers.  
  • CORS configured to allow only trusted origins.  
- **Rate Limiting**:  
  • Express-rate-limit to prevent abuse of API endpoints.  
- **Authentication/Authorization** (future):  
  • Token-based approach (JWT) can be layered over REST and WebSocket endpoints.  

## Monitoring and Maintenance

- **Logging**:  
  • Use Morgan or Winston for HTTP and application logs.  
  • Structured logs can ship to ELK stack or cloud logging services.  
- **Error Tracking**:  
  • Integrate Sentry or similar for real-time error alerts.  
- **Metrics & Alerts**:  
  • Prometheus + Grafana or cloud monitoring to track resource usage and request latencies.  
  • Define alerts on error rates, high latency, or container health.  
- **Database Migrations**:  
  • Drizzle ORM’s migration tooling keeps schema changes in version control.  
- **Updates & Rollbacks**:  
  • Versioned Docker images for safe rollbacks.  
  • CI/CD pipelines to automate tests, builds, and deployments.

## Conclusion and Overall Backend Summary

Perplexica’s backend is a robust, modular, and scalable system designed for real-time AI-driven search. By combining TypeScript, Express, Langchain, and Drizzle ORM, we achieve:

- Real-time streaming responses through WebSockets for a responsive UI.  
- Clear separation of concerns with agents, routes, and database modules.  
- Easy scalability via containerization and a strategy pattern for adding new search behaviors.  
- Secure, maintainable operations with TLS encryption, input validation, and centralized configuration.  

This setup supports the project’s goal: fast, reliable, and flexible AI-powered answers with up-to-date citations, ready to grow alongside user demand. 