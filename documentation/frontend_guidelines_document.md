# Frontend Guidelines Document

This document outlines the setup, architecture, and best practices for the Perplexica frontend. It’s written in simple terms so anyone—technical or not—can understand how the UI is built, styled, and organized.

## 1. Frontend Architecture

**Framework and Libraries**
- **Next.js**: Provides server-side rendering (SSR) and static generation, which makes pages load fast and improves SEO.
- **React**: Used for building reusable, interactive UI pieces (components).
- **Tailwind CSS**: A utility-first CSS framework that speeds up styling by offering ready-made classes.

**How It Fits Together**
- Next.js manages page routing and rendering. Each file in `ui/app/` becomes a page.
- React components live in `ui/components/` and are imported into pages or other components.
- Tailwind CSS classes are applied directly in JSX to style elements without writing separate CSS files.

**Benefits**
- **Scalability**: Adding new pages or components is as easy as creating new files.
- **Maintainability**: Logical folder structure and modular components keep code organized.
- **Performance**: SSR and code splitting mean users download only what they need, when they need it.

## 2. Design Principles

Perplexica’s UI follows three core principles:

1. **Usability**: Simple layouts and clear calls to action make it easy for users to ask questions and read answers.
2. **Accessibility**: We ensure text contrasts, use semantic HTML (buttons, headings, lists), and support keyboard navigation.
3. **Responsiveness**: The design adjusts gracefully from mobile phones to large desktops.

**How We Apply These**
- Buttons and links have clear hover and focus styles.
- Font sizes and spacing adapt based on screen size (using Tailwind’s responsive utilities like `sm:`, `md:`, `lg:`).
- All images and text blocks resize fluidly without breaking the layout.

## 3. Styling and Theming

**Styling Approach**
- We use **Tailwind CSS** in Just-In-Time mode, which generates only the classes we use.
- No global CSS files—styles live alongside components in JSX.

**Theming**
- Right now, we have a single light theme.
- To switch themes in the future, we can use Tailwind’s CSS variables or a React context that toggles a `dark` class on `<html>`.

**Visual Style**
- Overall look: **Modern**, **flat**, and **minimal**.
- Key UI pattern: **Glassmorphism** for chat bubbles (light translucent background with a subtle blur).

**Color Palette**
- Primary Blue: `#1E40AF` (buttons, links)
- Accent Cyan: `#06B6D4` (highlights)
- Background Light: `#F3F4F6`
- Surface White: `#FFFFFF`
- Text Dark: `#111827`
- Text Light: `#6B7280` (secondary text)

**Font**
- Primary font: **Inter**, a clean sans-serif.
- Fallbacks: `system-ui`, `-apple-system`, `BlinkMacSystemFont`.

## 4. Component Structure

**Organization**
- `ui/components/`: Reusable building blocks (buttons, inputs, chat bubbles).
- `ui/app/`: Page components and layouts.
- `ui/lib/`: Utility functions and hooks specific to the frontend.

**Component-Based Architecture**
- Each component does one thing and does it well (Single Responsibility).
- Components accept props to remain flexible and reusable.
- Common patterns:
  - **Presentational Components**: Purely render UI based on props.
  - **Container Components**: Handle data fetching, state, and pass results to presentational components.

**Why Components Matter**
- **Maintainability**: Fixing or updating one component fixes every place it’s used.
- **Reusability**: Shared logic and styles reduce duplication.

## 5. State Management

**Current Approach**
- We use **React hooks** (`useState`, `useEffect`) inside components for local state (e.g., input text, streaming response chunks).

**Sharing State**
- Chat messages and connection status live in a `ChatContext` (React Context) so any component can read or update them without prop drilling.

**Looking Ahead**
- For more complex scenarios (e.g., global settings, theme toggles), consider a lightweight library like **Zustand** or **Redux Toolkit**.

## 6. Routing and Navigation

**Next.js File-Based Routing**
- Place a file at `ui/app/page.tsx` → accessible at `/`
- Place a file at `ui/app/settings/page.tsx` → accessible at `/settings`

**Linking Between Pages**
- Use `next/link` component:
  ```jsx
  import Link from 'next/link'

  <Link href="/settings">
    <a className="text-primary-blue">Settings</a>
  </Link>
  ```

**Dynamic Routes**
- For chat rooms or individual queries, you might use files like `[chatId].tsx` under `ui/app/chat/`.

## 7. Performance Optimization

**Built-In Next.js Features**
- **SSR/SSG**: Pages can pre-render on the server or at build time.
- **Image Optimization**: Use `next/image` for automatic resizing and lazy loading.

**Additional Strategies**
- **Code Splitting**: Import heavy components dynamically with `next/dynamic`:
  ```jsx
  const ChatWindow = dynamic(() => import('../components/ChatWindow'), { ssr: false });
  ```
- **Lazy Loading**: Defer non-critical components until after the main UI is up.
- **Asset Optimization**: Serve SVGs or compressed images, and use system fonts where possible.

## 8. Testing and Quality Assurance

**Unit Tests**
- Framework: **Jest**
- Helpers: **React Testing Library** for testing component output and interactions.

**Integration Tests**
- Combine multiple components and simulate user flows, such as opening the chat window and receiving a streamed response.

**End-to-End (E2E) Tests**
- Tool: **Cypress**
- Scenarios:
  - User submits a query and sees a live response.
  - Settings page updates model provider and persists choice.

**Linting and Formatting**
- ESLint with a React/TypeScript config enforces code standards.
- Prettier auto-formats code on save.

**Continuous Integration (CI)**
- Run tests and linters on every pull request using GitHub Actions or a similar tool.

## 9. Conclusion and Overall Frontend Summary

We’ve built Perplexica’s frontend with clarity and performance in mind. Using Next.js, React, and Tailwind CSS, we ensure a fast, responsive, and maintainable user interface. Our component-based structure and clear design principles keep development straightforward—even as the project grows.

Key takeaways:
- **Modular Components** keep code DRY and easy to maintain.
- **Tailwind CSS** speeds up styling and enforces consistency.
- **Next.js** handles routing and optimization out of the box.
- **Testing Strategy** protects against regressions and ensures quality.

By following these guidelines, any team member—new or experienced—can confidently contribute to and expand Perplexica’s frontend.