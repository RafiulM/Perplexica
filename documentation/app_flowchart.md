flowchart TD
    UI[Nextjs UI] --> WS[Websocket Server]
    UI --> API[REST API]
    WS --> MH[messageHandler]
    API --> MH
    MH --> MODE{Focus Mode}
    MODE --> WEB[Web Search Agent]
    MODE --> ACD[Academic Search Agent]
    WEB --> SEARX[SearxNG Instance]
    ACD --> SEARX
    WEB --> LLM[LLM Integration]
    ACD --> LLM
    MH --> DB[SQLite Database]
    DB --> UI