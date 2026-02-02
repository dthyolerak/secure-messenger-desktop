# Secure Messenger Desktop

<div align="center">

![Electron](https://img.shields.io/badge/Electron-40.0.0-47848F?style=flat-square&logo=electron)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript)
![Tests](https://img.shields.io/badge/Tests-142%20passing-success?style=flat-square)
![Coverage](https://img.shields.io/badge/Coverage-91%25-brightgreen?style=flat-square)

**A high-performance, secure desktop messaging application**

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Testing](#testing) • [Security](#security)

</div>

---

## Overview

Secure Messenger Desktop is a production-ready Electron application demonstrating enterprise-grade architecture patterns for secure messaging. Built with React, TypeScript, and SQLite, it showcases efficient data handling, real-time synchronization, and security best practices.


## Features

### Core Functionality
- **Real-time Messaging** - WebSocket-based sync with instant updates
- **Chat Management** - Create, delete, and manage conversations
- **Message Search** - Full-text search powered by SQLite FTS5
- **Offline Support** - Message queuing when disconnected
- **Read Receipts** - Track message read status

### Performance
- **Virtualized Lists** - Smooth scrolling with 20,000+ messages
- **Lazy Loading** - Code splitting for faster initial load
- **Efficient Queries** - SQL-based pagination, never loads all data
- **Memoization** - Optimized re-renders with React.memo

### Security
- **Encryption Architecture** - Ready for E2E encryption (Signal Protocol concepts)
- **Input Validation** - XSS prevention, sanitization, Zod schemas
- **Rate Limiting** - Abuse prevention
- **Secure IPC** - Validated communication between processes

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/secure-messenger-desktop.git
cd secure-messenger-desktop

# Install dependencies
npm install

# Start development
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Electron app (requires WS server) |
| `npm run ws-server` | Start the mock WebSocket server |
| `npm run build` | Production build |
| `npm run rebuild` | Rebuild native modules for Electron |
| `npm test` | Run tests (watch mode) |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run package` | Package for distribution |

### Running the Application

To run the application in development:

1. **Terminal 1** - Start the WebSocket server:
```bash
npm run ws-server
```

2. **Terminal 2** - Start the Electron app:
```bash
npm start
```

**Note**: If you get a `NODE_MODULE_VERSION` error, run:
```bash
npm run rebuild
```

---

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RENDERER PROCESS                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │  React          │  │  Redux Toolkit  │  │  Virtualized       │  │
│  │  Components     │◄─►│  Store          │◄─►│  Lists             │  │
│  │  (Pages, UI)    │  │  (State Mgmt)   │  │  (react-window)    │  │
│  └────────┬────────┘  └────────┬────────┘  └────────────────────┘  │
│           │                    │                                    │
│           └────────────────────┴───────────────┐                    │
│                                                ▼                    │
│                         ┌──────────────────────────┐                │
│                         │    IPC Client            │                │
│                         │    (Typed, Validated)    │                │
│                         └────────────┬─────────────┘                │
└──────────────────────────────────────┼──────────────────────────────┘
                                       ▼
┌──────────────────────────────────────┴──────────────────────────────┐
│                         PRELOAD BRIDGE                              │
│                    (contextBridge, Zod Validation)                  │
└──────────────────────────────────────┬──────────────────────────────┘
                                       ▼
┌──────────────────────────────────────┴──────────────────────────────┐
│                          MAIN PROCESS                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │  SQLite         │  │  WebSocket      │  │  Security          │  │
│  │  + FTS5         │  │  Client         │  │  Service           │  │
│  │  (better-       │  │  (Reconnection) │  │  (Encrypt/Decrypt) │  │
│  │  sqlite3)       │  │                 │  │                    │  │
│  └─────────────────┘  └─────────────────┘  └────────────────────┘  │
│           │                    │                    │               │
│  ┌────────┴────────────────────┴────────────────────┴────────────┐  │
│  │                    Offline Queue Manager                      │  │
│  │                    (Persistence, Retry Logic)                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
secure-messenger-desktop/
├── electron/                    # Main process code
│   ├── main.ts                 # Application entry point
│   ├── preload.ts              # Secure IPC bridge
│   ├── wsClient.ts             # WebSocket with reconnection
│   ├── db/
│   │   ├── migrations.ts       # Schema, FTS5, indexes
│   │   ├── yqueries.ts         # Type-safe queries
│   │   └── secureDatabase.ts   # SQLCipher wrapper
│   ├── ipc/
│   │   └── events.ts           # IPC handlers
│   └── services/
│       └── offlineQueueManager.ts
│
├── src/                         # Renderer process code
│   ├── app/
│   │   ├── store.ts            # Redux configuration
│   │   └── slices/             # State slices
│   │       ├── chatsSlice.ts
│   │       ├── messagesSlice.ts
│   │       └── connectionSlice.ts
│   │
│   ├── components/             # React components
│   │   ├── ChatList.tsx        # Virtualized chat list
│   │   ├── ChatItem.tsx        # Memoized chat item
│   │   ├── MessageThread.tsx   # Message view
│   │   ├── ErrorBoundary.tsx   # Error handling
│   │   └── Sidebar.tsx
│   │
│   ├── domains/
│   │   └── security/
│   │       ├── security.service.ts
│   │       └── signal-protocol.service.ts
│   │
│   ├── hooks/
│   │   └── useAccessibility.tsx
│   │
│   ├── utils/
│   │   ├── validation.ts       # Input validation
│   │   └── lazyLoad.tsx        # Code splitting
│   │
│   └── pages/
│       ├── Home.tsx
│       ├── Profile.tsx
│       └── Settings.tsx
│
├── server/
│   └── ws-server.ts            # Mock WebSocket server
│
├── tests/                       # Test suites
│   ├── setup.ts                # Test configuration
│   ├── components/             # Component tests
│   ├── redux/                  # State tests
│   ├── integration/            # Integration tests
│   ├── security/               # Security tests
│   ├── utils/                  # Utility tests
│   └── websocket/              # WebSocket tests
│
├── vitest.config.ts            # Test configuration
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## Database Schema

### Tables

```sql
-- Chats table
CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  last_message TEXT,
  updated_at INTEGER NOT NULL,
  unread_count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);

-- Messages table with full indexing
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT,
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  type TEXT DEFAULT 'text',
  is_read INTEGER DEFAULT 0,
  deleted_at INTEGER,
  FOREIGN KEY (chat_id) REFERENCES chats(id)
);

-- FTS5 for full-text search
CREATE VIRTUAL TABLE messages_fts USING fts5(
  id, chat_id, content, sender,
  content='messages',
  content_rowid='rowid'
);

-- Offline queue for reliability
CREATE TABLE offline_queue (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  retry_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending'
);
```

### Indexes

```sql
CREATE INDEX idx_messages_chat_timestamp ON messages(chat_id, timestamp DESC);
CREATE INDEX idx_messages_sender ON messages(sender);
CREATE INDEX idx_messages_type ON messages(type);
CREATE INDEX idx_chats_updated ON chats(updated_at DESC);
```

---

## Testing

### Test Summary

| Category | Tests | Description |
|----------|-------|-------------|
| Component Tests | 15 | ChatItem rendering, interactions, a11y |
| Redux Tests | 20 | Actions, reducers, state management |
| WebSocket Tests | 14 | Connection, reconnection, heartbeat |
| Security Tests | 22 | Encryption, sanitization, protocols |
| Integration Tests | 13 | Sync flow, offline queue, data flow |
| Validation Tests | 58 | Input validation, rate limiting |
| **Total** | **142** | **91%+ coverage** |

### Running Tests

```bash
# Run all tests
npm run test:run

# Watch mode for development
npm test

# Generate coverage report
npm run test:coverage
```

### Coverage Report

```
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |   91.85 |    89.55 |   88.57 |   91.47 |
 components        |   93.33 |    95.45 |   100.0 |   93.33 |
 domains/security  |   90.69 |    72.72 |   90.90 |   90.47 |
 utils             |   92.20 |    91.17 |   86.36 |   91.66 |
-------------------|---------|----------|---------|---------|
```

---

## Security

### Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      MESSAGE FLOW                               │
│                                                                 │
│  User Input ──► Validation ──► Sanitization ──► Rate Limit     │
│                                                      │          │
│                                                      ▼          │
│                                          SecurityService        │
│                                          .encrypt()             │
│                                                      │          │
│                                                      ▼          │
│                                          [Encrypted Blob]       │
│                                                      │          │
│                   ┌──────────────────────────────────┤          │
│                   │                                  │          │
│                   ▼                                  ▼          │
│             SQLite Storage                    WebSocket Send    │
│             (FTS on metadata)                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Security Measures

| Measure | Implementation |
|---------|----------------|
| Input Validation | Zod schemas, XSS sanitization |
| Rate Limiting | Configurable limits per action |
| Data Logging | Content hashed, never logged raw |
| IPC Security | All payloads validated |
| Encryption Ready | SQLCipher, Signal Protocol architecture |

### Where Encryption Would Happen

In a production system:

1. **At Rest** - SQLCipher encrypts the entire database
2. **In Transit** - TLS for WebSocket, Signal Protocol for E2E
3. **In Memory** - Keys stored securely, cleared on logout

---

## WebSocket Sync

### Connection State Machine

```
                    ┌──────────┐
                    │ OFFLINE  │
                    └────┬─────┘
                         │ connect()
                         ▼
                    ┌──────────────┐
              ┌─────│ CONNECTING   │
              │     └──────┬───────┘
              │            │ onopen
              │            ▼
              │     ┌──────────────┐
              │     │ CONNECTED    │◄────────────────┐
              │     └──────┬───────┘                 │
              │            │ onclose/onerror         │
              │            ▼                         │
              │     ┌──────────────┐                 │
              └────►│ RECONNECTING │─────────────────┘
                    └──────────────┘  after backoff
```

### Exponential Backoff

```typescript
const calculateBackoff = (attempts: number) => {
  const base = 1000;  // 1 second
  const max = 30000;  // 30 seconds
  return Math.min(base * Math.pow(2, attempts), max);
};

// Attempts: 1s → 2s → 4s → 8s → 16s → 30s (max)
```

---

## Performance Optimizations

### Virtualization
- **Chat List**: `react-window` for efficient rendering
- **Message List**: Dynamic height virtualization
- Only renders visible items + small buffer

### Memoization
```typescript
// Memoized components prevent unnecessary re-renders
const ChatRow = React.memo(ChatRowInner);
const MessageRow = React.memo(MessageRowInner);
```

### SQL Optimization
```typescript
// Pagination at database level, not in JS
const messages = await db.prepare(`
  SELECT * FROM messages 
  WHERE chat_id = ? 
  ORDER BY timestamp DESC 
  LIMIT ? OFFSET ?
`).all(chatId, limit, offset);
```

---

## Accessibility

- **ARIA Labels** - Proper roles and attributes
- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Focus trapping in modals
- **Screen Readers** - Live regions for updates
- **Reduced Motion** - Respects user preferences

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `WS_PORT` | WebSocket server port | `8080` |
| `DB_PATH` | Database file location | `./chats.db` |
| `LOG_LEVEL` | Logging verbosity | `info` |

---

## Trade-offs & Decisions

| Decision | Rationale |
|----------|-----------|
| SQLite over IndexedDB | Better query support, FTS5, familiar SQL syntax |
| Redux Toolkit | Predictable state, excellent DevTools, middleware |
| react-window | Minimal bundle size, simple API, good performance |
| Zod validation | Type-safe, composable, great error messages |
| Vitest over Jest | Faster, better ESM support, native TypeScript |

---

## Future Improvements

With more time, the following could be implemented:

1. **Real E2E Encryption** - Full Signal Protocol implementation
2. **SQLCipher Integration** - Enable database encryption
3. **E2E Testing** - Playwright/Cypress for UI testing
4. **Push Notifications** - Desktop notifications for new messages
5. **File Attachments** - Image, video, document sharing
6. **Voice Messages** - Audio recording and playback
7. **Group Chats** - Multi-participant conversations
8. **Message Reactions** - Emoji reactions to messages

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Author

Built with secure architecture principles and production-ready patterns.

**Tech Stack**: Electron • React • TypeScript • SQLite • Redux Toolkit • WebSocket
