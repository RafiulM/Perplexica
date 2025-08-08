# Perplexica Codebase Security Guidelines

This document provides a comprehensive set of security recommendations tailored to the Perplexica open-source AI search engine. It aligns with industry best practices and the core security principles: Security by Design, Least Privilege, Defense in Depth, Input Validation & Output Encoding, Fail Securely, Simplify Security, and Secure Defaults.

---

## 1. Authentication & Access Control

Although Perplexica currently does not expose end-user authentication, it relies heavily on API keys, configuration files, and administrative endpoints. Secure these elements as follows:

• Store all API keys and secrets in environment variables or a dedicated secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager). Do **not** check them into `config.toml` in Git.

• Enforce role-based access control (RBAC) for any administrative or configuration-management endpoints. Example roles:
  - **Admin:** configure models, rotate keys, view system logs
  - **Operator:** view metrics, monitor bot status
  - **Read-only:** fetch public configuration only

• If you introduce user authentication in the future, adopt strong password policies (minimum 12 characters, complexity requirements, rate-limited login attempts) and secure hashing (Argon2 or bcrypt with per-user salt).

• Protect all administrative routes with server-side authorization checks. Example (Express.js + TypeScript):
  ```typescript
  app.use('/admin', verifyJwtMiddleware, checkRole('admin'));  
  ```

---

## 2. Input Handling & Processing

Perplexica processes untrusted data from users, SearxNG responses, and LLM outputs. Mitigate injection and related attacks:

• **Validate & Sanitize Incoming Payloads**
  - Use a schema validation library (e.g., Zod, Joi) for WebSocket messages and REST endpoints. Reject unexpected fields.
  - Enforce strict types (e.g., string, array) and length limits (e.g., query ≤ 256 chars).

• **Prevent Prompt Injection**
  - Sanitize user queries before incorporating them into LLM prompts.
  - Use a robust prompt‐templating approach (Langchain’s `PromptTemplate`) to isolate variables.

• **Use Parameterized Arguments**
  - When interacting with SQLite via Drizzle ORM, rely exclusively on parameterized queries to avoid SQL injection.

• **Secure File & URL Handling**
  - If you allow file uploads or redirects (currently not implemented), enforce allow-lists for extensions, MIME types, and redirect targets.

---

## 3. Data Protection & Privacy

Perplexica persists chat history and configuration data. Protect this information as follows:

• **Encrypt Data in Transit**
  - Terminate TLS at the proxy or load balancer (TLS v1.2+ only).
  - Enforce HTTPS in Next.js by setting `NEXT_PUBLIC_PROTOCOL = https` and redirecting HTTP → HTTPS.

• **Encrypt Data at Rest**
  - For production, consider migrating from file-based SQLite to a managed database with encryption-at-rest (e.g., AWS RDS with AES-256).

• **Protect PII**
  - Users’ queries may contain personal information. Mask or redact sensitive tokens before logging.

• **Secrets Management**
  - Remove all hardcoded secrets from `config.toml`. Use `.env` files excluded via `.gitignore` or a vault provider.

---

## 4. API & Service Security

The Express.js backend and Next.js frontend expose various HTTP and WebSocket endpoints:

• **Enforce HTTPS & HSTS**
  - Serve all endpoints over TLS and set the `Strict-Transport-Security` header:
    ```js
    app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true }));
    ```

• **Rate Limiting & Throttling**
  - Prevent abuse of the search API and brute-force attempts using `express-rate-limit`:
    ```js
    app.use('/api/search', rateLimit({ windowMs: 60_000, max: 60 }));  
    ```

• **CORS Configuration**
  - Restrict origins in Next.js `next.config.js` and Express `cors()` to your production domains only.

• **HTTP Method Enforcement**
  - Use proper verbs (`GET` for retrieval, `POST` for new queries). Reject unsupported methods with `405 Method Not Allowed`.

• **Minimal Data Exposure**
  - Return only required fields in API responses (avoid echoing full chat history or model credentials).

---

## 5. Web Application Security Hygiene

Hardening the Next.js frontend and React components:

• **Security Headers** (use Helmet in Express, custom `_document.js` in Next.js):
  - `Content-Security-Policy`: restrict sources for scripts, styles, images.
  - `X-Frame-Options: DENY` to prevent clickjacking.
  - `X-Content-Type-Options: nosniff`.
  - `Referrer-Policy: no-referrer-when-downgrade`.

• **Cookie Security**
  - If you use cookies for sessions, set `Secure`, `HttpOnly`, and `SameSite=Strict`.

• **Avoid Client-Side Secrets**
  - Never expose API keys or internal endpoints in `publicRuntimeConfig` or `NEXT_PUBLIC_*` variables.

• **Subresource Integrity (SRI)**
  - If you load third-party scripts (e.g., analytics), include SRI hashes to prevent tampering.

---

## 6. Infrastructure & Configuration Management

The Dockerized environment and host OS should follow security best practices:

• **Secure Docker Images**
  - Base images: use slim or Alpine variants, pinned to specific versions.
  - Scan images for CVEs (e.g., using Trivy or Clair).

• **Least Privilege in Containers**
  - Run Node and Next.js processes as non-root users.
  - Mount volumes read-only where possible (e.g., static assets).

• **Network Segmentation**
  - Expose only necessary ports (e.g., 443/80, WebSocket port if separate).
  - Keep the SQLite data volume accessible only to the backend container.

• **Disable Debug in Prod**
  - Ensure `NODE_ENV=production` and disable any debug-level logging or hot-reload features.

---

## 7. Dependency Management

Maintain a minimal, secure dependency footprint:

• **Lockfiles**
  - Commit `package-lock.json` and `yarn.lock` to enforce deterministic builds.

• **Regular Vulnerability Scanning**
  - Integrate an SCA tool (e.g., GitHub Dependabot, Snyk) to detect known CVEs.

• **Update Dependencies**
  - Schedule periodic maintenance windows to upgrade Express, Next.js, Drizzle ORM, Langchain, and other core libraries.

• **Vet New Packages**
  - Review npm package security posture, download counts, and maintenance activity before introducing new dependencies.

---

## 8. Observability & Secure Failure Handling

• **Centralized Logging**
  - Use a structured logger (e.g., Winston, Pino) and redact sensitive fields (API keys, user PII).

• **Monitoring & Alerts**
  - Emit metrics on error rates, latency, CPU/RAM usage, and rate-limit events. Hook into Prometheus/Grafana or a SaaS monitoring solution.

• **Fail Securely**
  - Catch all unhandled exceptions at the process boundary, log minimal details, and return a generic error to the client.
    ```js
    process.on('uncaughtException', (err) => {  
      logger.error('Unhandled Exception', { message: err.message });  
      process.exit(1);  
    });
    ```

---

## Conclusion
By incorporating these guidelines into the Perplexica development lifecycle—design, implementation, testing, and deployment—you will dramatically reduce risk, protect user data, and maintain a robust, secure AI search platform. Regularly review and adapt these controls as the project evolves and new threats emerge.