# Secure Messenger Desktop

A secure Electron + React + TypeScript desktop messenger application demonstrating efficient local data access, real-time WebSocket sync, and UI performance with large lists.

![Secure Messenger Desktop](./docs/screenshot.png)

## Features

- **Local SQLite Storage**: Efficient data persistence with indexed queries
- **Real-time WebSocket Sync**: Live message updates with reconnection handling
- **Virtualized Lists**: High-performance rendering of large chat/message lists
- **Connection Health**: Visual indicators with reconnection/offline states
- **Security Boundaries**: Placeholder encryption service with secure IPC

## Quick Start

```bash
# Install dependencies
npm install

# Start the application (runs both Electron and WebSocket server)
npm start

# Or run development mode with hot reload
npm run dev
```

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/secure-messenger-desktop.git
cd secure-messenger-desktop
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the application:
```bash
npm start
```

### Demo Credentials

- Username: `demo` (or any username)
- Password: `demo123`

## Architecture Overview

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Renderer Process                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   React UI  │  │ Redux Store │  │   IPC Client        │ │
│  │ (Virtualized│  │  (Slices)   │  │ (syncIpcClient.ts)  │ │
│  │   Lists)    │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                           │                    │            │
└───────────────────────────┼────────────────────┼────────────┘
                            │ IPC (contextBridge)│
┌───────────────────────────┼────────────────────┼────────────┐
│                     Preload (Secure Bridge)                 │
│                    ┌──────┴────────────────────┴──────┐     │
│                    │     Typed API + Zod Validation   │     │
│                    └─────────────────────────────────-┘     │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                     Main Process                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   SQLite    │  │  WebSocket  │  │    IPC Handlers     │ │
│  │  (better-   │  │   Client    │  │  (events.ts)        │ │
│  │   sqlite3)  │  │             │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Mock WebSocket Server                     │
│             (ws-server.ts - localhost:8080)                 │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
secure-messenger-desktop/
├── electron/
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # Secure IPC bridge
│   ├── wsClient.ts          # WebSocket client with reconnection
│   ├── db/
│   │   ├── yqueries.ts      # SQLite query layer
│   │   └── migrations.ts    # Schema migrations
│   └── ipc/
│       └── events.ts        # IPC event handlers
├── src/
│   ├── app/
│   │   ├── store.ts         # Redux store
│   │   └── slices/          # Redux slices
│   ├── components/
│   │   ├── ChatList.tsx     # Virtualized chat list
│   │   ├── MessageThread.tsx # Virtualized message list
│   │   └── ...
│   ├── domains/
│   │   ├── auth/            # Authentication domain
│   │   ├── messages/        # Messages domain
│   │   ├── chats/           # Chats domain
│   │   └── security/        # Security service
│   └── services/
│       └── syncIpcClient.ts # IPC wrapper
├── server/
│   └── ws-server.ts         # Mock WebSocket server
└── package.json
```

### Data Flow

1. **User Action** → React Component
2. **Component** → Redux Action / IPC Call
3. **IPC Call** → Preload (validates with Zod)
4. **Preload** → Main Process Handler
5. **Handler** → SQLite / WebSocket
6. **Response** → IPC Event → Redux → UI Update

### Key Modules

| Module | Responsibility |
|--------|---------------|
| `electron/wsClient.ts` | WebSocket connection with heartbeat, reconnection |
| `electron/db/yqueries.ts` | SQLite queries with pagination |
| `src/components/ChatList.tsx` | Virtualized chat list (react-window) |
| `src/components/MessageThread.tsx` | Virtualized message list |
| `src/domains/security/security.service.ts` | Encryption placeholders |

## Database Schema

### Tables

```sql
-- Chats table
CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  last_message TEXT,
  updated_at INTEGER NOT NULL,
  unread_count INTEGER DEFAULT 0
);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);

-- Messages table
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  content TEXT,
  timestamp INTEGER NOT NULL,
  read_at INTEGER,
  is_edited INTEGER DEFAULT 0,
  type TEXT DEFAULT 'text',
  file_path TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT
);
CREATE INDEX idx_messages_chat_timestamp ON messages(chat_id, timestamp DESC);
```

### Query Patterns

- **Chat list**: `ORDER BY updated_at DESC LIMIT 50 OFFSET ?`
- **Messages**: `ORDER BY timestamp DESC LIMIT 50 OFFSET ?`
- **Search**: `WHERE LOWER(content) LIKE ?` (FTS recommended for production)

## WebSocket Sync

### Connection States

| State | Description |
|-------|-------------|
| `connected` | Active WebSocket connection |
| `reconnecting` | Attempting to reconnect (exponential backoff) |
| `offline` | Connection failed, working offline |

### Reconnection Strategy

- **Heartbeat**: Ping every 10 seconds
- **Pong timeout**: 5 seconds
- **Backoff**: Exponential (1s, 2s, 4s, ... up to 30s)
- **Max attempts**: 10

### Event Types

```typescript
// New message
{ type: 'new_message', payload: { id, chat_id, sender, content, timestamp } }

// Chat update
{ type: 'chat_update', payload: { chat_id, name, unread_count, updated_at } }
```

## Security Architecture

### Where Encryption Would Happen

In a production system:

1. **Message Encryption**: Before SQLite storage in `insertMessage()`
2. **Key Derivation**: From user password using PBKDF2/Argon2
3. **Chat Keys**: Derived per-chat for forward secrecy
4. **Storage**: SQLCipher for database encryption

### Preventing Data Leaks

1. **Logging**: Message content is never logged (only hashed metadata)
2. **IPC Boundary**: Preload validates all inputs with Zod
3. **Context Isolation**: Renderer has no direct Node.js access
4. **Dev Tools**: Should be disabled in production builds
5. **Crash Dumps**: Should be encrypted or disabled

### Security Service

```typescript
// src/domains/security/security.service.ts
await securityService.encrypt(plaintext, chatId);
await securityService.decrypt(encrypted, chatId);
securityService.sanitizeForLogging(message); // Removes sensitive fields
```

## Performance Optimizations

### Virtualization

- **ChatList**: Uses `react-window` with fixed 72px row height
- **MessageThread**: Uses `react-window` with dynamic row heights
- **Overscan**: 5 rows for smooth scrolling

### Database

- **Indexes**: On `updated_at`, `chat_id + timestamp`
- **Pagination**: SQL-based LIMIT/OFFSET
- **No Full Loads**: Never loads all messages into memory

### React

- **useCallback**: For event handlers
- **useMemo**: For sorted/filtered data
- **Debounced Search**: 250ms delay

## Trade-offs & Future Improvements

### Current Limitations

1. **No FTS**: Message search uses LIKE (slow for large datasets)
2. **Schema Inconsistency**: Some legacy code uses different field names
3. **Missing Tests**: No unit/integration tests
4. **Component Memoization**: ChatRow/MessageRow could be memoized

### With More Time

1. **Add FTS5** for fast message search
2. **Implement SQLCipher** for database encryption
3. **Add unit tests** for DB queries and connection state
4. **Memoize row components** with React.memo
5. **Add E2E encryption** with Signal Protocol
6. **Implement offline queue** for messages when disconnected
7. **Add message reactions sync** via WebSocket
8. **Improve seed data** (200 chats, 20,000 messages)

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the application |
| `npm run dev` | Development mode with hot reload |
| `npm run build` | Build all (main, preload, renderer) |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint checking |

## Testing Connection Recovery

1. Go to **Settings** → **Developer Tools**
2. Click **"Simulate Connection Drop"**
3. Observe reconnection with exponential backoff
4. Click **"Force Reconnect"** to manually reconnect

## License

MIT
