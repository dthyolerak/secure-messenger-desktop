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
      FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_messages_chat_timestamp
      ON messages(chat_id, timestamp DESC);
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
    return;
  }

  const columnNames = new Set(columns.map((column) => column.name));
  const needsMigration = !columnNames.has('recipient') || !columnNames.has('read_at');

  if (!needsMigration) {
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
        is_edited
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    rows.forEach((row) => {
      const sender = row.sender ?? row.sender_id ?? 'Unknown';
      const inferredRecipient = sender === currentUser
        ? chatNamesById.get(row.chat_id) || 'Unknown'
        : currentUser;
      const recipient = row.recipient ?? inferredRecipient;
      const readAt = row.read_at ?? (row.is_read ? row.timestamp : null);
      const isEdited = typeof row.is_edited === 'number' ? row.is_edited : 0;

      insert.run(
        row.id,
        row.chat_id,
        sender,
        recipient,
        row.content,
        row.timestamp,
        readAt,
        isEdited
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
}

export function ensureMessageSchema(db: Database, currentUser: string = DEFAULT_CURRENT_USER): void {
  ensureMessagesTable(db);
  migrateMessagesSchema(db, currentUser);
}
