// electron/db/migrations.ts
import type { Database } from 'better-sqlite3';

interface TableColumn {
  name: string;
}

interface MessageRow {
  id: string;
  chat_id: string;
  sender?: string;
  sender_id?: string;
  recipient?: string;
  content: string;
  timestamp: number;
  read_at?: number | null;
  is_read?: number | null;
  is_edited?: number | null;
  type?: string | null;
  file_path?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
}

interface ChatRow {
  id: string;
  name: string;
}

const DEFAULT_CURRENT_USER = 'You';

function ensureMessagesTable(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      recipient TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      read_at INTEGER,
      is_edited INTEGER DEFAULT 0,
      type TEXT NOT NULL DEFAULT 'text',
      file_path TEXT,
      file_name TEXT,
      file_size INTEGER,
      mime_type TEXT,
      FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_chat_timestamp
      ON messages(chat_id, timestamp DESC);
  `);
}

function ensureMessageReactionsTable(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS message_reactions (
      id TEXT PRIMARY KEY,
      message_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      emoji TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE,
      UNIQUE(message_id, user_id, emoji)
    );

    CREATE INDEX IF NOT EXISTS idx_message_reactions_message
      ON message_reactions(message_id, emoji);
  `);
}

function getMessagesColumns(db: Database): TableColumn[] {
  return db.prepare('PRAGMA table_info(messages)').all() as TableColumn[];
}

function getChatNamesById(db: Database): Map<string, string> {
  const rows = db.prepare('SELECT id, name FROM chats').all() as ChatRow[];
  return new Map(rows.map((row) => [row.id, row.name]));
}

/**
 * Safe migration to ensure messages schema includes sender/recipient/read_at.
 * Uses a temp table to preserve existing data without destructive drops.
 */
export function migrateMessagesSchema(db: Database, currentUser: string = DEFAULT_CURRENT_USER): void {
  const columns = getMessagesColumns(db);
  if (columns.length === 0) {
    ensureMessagesTable(db);
    ensureMessageReactionsTable(db);
    return;
  }

  const columnNames = new Set(columns.map((column) => column.name));
  const needsMigration =
    !columnNames.has('recipient') ||
    !columnNames.has('read_at') ||
    !columnNames.has('type') ||
    !columnNames.has('file_path') ||
    !columnNames.has('file_name') ||
    !columnNames.has('file_size') ||
    !columnNames.has('mime_type');

  if (!needsMigration) {
    ensureMessageReactionsTable(db);
    return;
  }

  const chatNamesById = getChatNamesById(db);

  const migrate = db.transaction(() => {
    db.exec(`
      CREATE TABLE messages_new (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        recipient TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        read_at INTEGER,
        is_edited INTEGER DEFAULT 0,
        type TEXT NOT NULL DEFAULT 'text',
        file_path TEXT,
        file_name TEXT,
        file_size INTEGER,
        mime_type TEXT,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
    `);

    const rows = db.prepare('SELECT * FROM messages').all() as MessageRow[];
    const insert = db.prepare(`
      INSERT INTO messages_new (
        id,
        chat_id,
        sender,
        recipient,
        content,
        timestamp,
        read_at,
        is_edited,
        type,
        file_path,
        file_name,
        file_size,
        mime_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    rows.forEach((row) => {
      const sender = row.sender ?? row.sender_id ?? 'Unknown';
      const inferredRecipient = sender === currentUser
        ? chatNamesById.get(row.chat_id) || 'Unknown'
        : currentUser;
      const recipient = row.recipient ?? inferredRecipient;
      const readAt = row.read_at ?? (row.is_read ? row.timestamp : null);
      const isEdited = typeof row.is_edited === 'number' ? row.is_edited : 0;
      const type = row.type ?? 'text';

      insert.run(
        row.id,
        row.chat_id,
        sender,
        recipient,
        row.content,
        row.timestamp,
        readAt,
        isEdited,
        type,
        row.file_path ?? null,
        row.file_name ?? null,
        row.file_size ?? null,
        row.mime_type ?? null
      );
    });

    db.exec('DROP TABLE messages');
    db.exec('ALTER TABLE messages_new RENAME TO messages');
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_chat_timestamp
        ON messages(chat_id, timestamp DESC);
    `);
  });

  migrate();
  ensureMessageReactionsTable(db);
}

export function ensureMessageSchema(db: Database, currentUser: string = DEFAULT_CURRENT_USER): void {
  ensureMessagesTable(db);
  migrateMessagesSchema(db, currentUser);
  ensureMessageReactionsTable(db);
}
