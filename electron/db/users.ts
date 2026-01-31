// electron/db/users.ts
import { Database } from 'better-sqlite3';
import { z } from 'zod';

// User schema for validation
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  display_name: z.string(),
  username: z.string(),
  password_hash: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export class UsersDB {
  constructor(private db: Database) {}

  /**
   * UPSERT user - Insert or update user without violating constraints
   * Uses INSERT OR REPLACE to handle duplicates gracefully
   */
  upsertUser(user: {
    id?: string;
    email: string;
    display_name: string;
    username: string;
    password_hash?: string;
  }): { success: boolean; user?: any; error?: string } {
    try {
      const now = Date.now();
      const userId = user.id || `user_${now}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Use INSERT OR REPLACE to handle duplicates
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO users (id, email, display_name, username, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 
          COALESCE((SELECT created_at FROM users WHERE id = ?), ?),
          ?
        )
      `);

      stmt.run(
        userId,
        user.email,
        user.display_name,
        user.username,
        user.password_hash || 'demo_hash',
        userId,
        now,
        now
      );

      // Get the user data
      const insertedUser = this.db.prepare(`
        SELECT id, email, display_name, username, created_at, updated_at
        FROM users WHERE id = ?
      `).get(userId);

      console.log(`[USERS] Upserted user: ${user.display_name} (${userId})`);
      
      return {
        success: true,
        user: insertedUser
      };
    } catch (error) {
      console.error('[USERS] Failed to upsert user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user by email - used for login
   */
  getUserByEmail(email: string): any | null {
    try {
      const user = this.db.prepare(`
        SELECT id, email, display_name, username, created_at, updated_at
        FROM users WHERE email = ?
      `).get(email);
      
      return user || null;
    } catch (error) {
      console.error('[USERS] Failed to get user by email:', error);
      return null;
    }
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): any | null {
    try {
      const user = this.db.prepare(`
        SELECT id, email, display_name, username, created_at, updated_at
        FROM users WHERE id = ?
      `).get(userId);
      
      return user || null;
    } catch (error) {
      console.error('[USERS] Failed to get user by ID:', error);
      return null;
    }
  }

  /**
   * Get ALL users except current user - for global chat list
   * This is the critical function for the global chat listing requirement
   */
  getAllUsers(currentUserId: string): { success: boolean; users?: any[]; error?: string } {
    try {
      const users = this.db.prepare(`
        SELECT id, email, display_name, username, created_at, updated_at
        FROM users 
        WHERE id != ?
        ORDER BY display_name ASC
      `).all(currentUserId);

      console.log(`[USERS] Retrieved ${users.length} users for global chat list`);
      
      return {
        success: true,
        users
      };
    } catch (error) {
      console.error('[USERS] Failed to get all users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search users by username or display name
   */
  searchUsers(query: string, currentUserId: string): { success: boolean; users?: any[]; error?: string } {
    try {
      const searchPattern = `%${query.toLowerCase()}%`;
      const users = this.db.prepare(`
        SELECT id, email, display_name, username, created_at, updated_at
        FROM users 
        WHERE (LOWER(username) LIKE ? OR LOWER(display_name) LIKE ?)
        AND id != ?
        ORDER BY display_name ASC
        LIMIT 20
      `).all(searchPattern, searchPattern, currentUserId);

      console.log(`[USERS] Search for "${query}" returned ${users.length} users`);
      console.log(`[USERS] Search pattern: "${searchPattern}"`);
      
      // Debug: Log the users found
      if (users.length > 0) {
        console.log(`[USERS] Found users:`, users.map((u: any) => `${u.display_name} (@${u.username})`));
      }
      
      return {
        success: true,
        users
      };
    } catch (error) {
      console.error('[USERS] Failed to search users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Seed demo users - only run during app startup
   * Uses INSERT OR IGNORE to prevent duplicates
   */
  seedDemoUsers(): { success: boolean; seeded?: number; error?: string } {
    try {
      const demoUsers = [
        ['user1', 'donnex@example.com', 'Donnex Thyolera', 'donnex'],
        ['user2', 'james@example.com', 'James Wilson', 'james'],
        ['user3', 'alice@example.com', 'Alice Johnson', 'alice'],
        ['user4', 'bob@example.com', 'Bob Smith', 'bob'],
        ['user5', 'carol@example.com', 'Carol White', 'carol'],
        ['user6', 'david@example.com', 'David Brown', 'david'],
        ['user7', 'emma@example.com', 'Emma Davis', 'emma'],
        ['user8', 'frank@example.com', 'Frank Miller', 'frank'],
        ['user9', 'grace@example.com', 'Grace Wilson', 'grace'],
        ['user10', 'henry@example.com', 'Henry Moore', 'henry'],
        ['user11', 'ivy@example.com', 'Ivy Chen', 'ivy'],
        ['user12', 'jack@example.com', 'Jack Taylor', 'jack'],
        ['user13', 'kate@example.com', 'Kate Anderson', 'kate'],
        ['user14', 'liam@example.com', 'Liam Thomas', 'liam'],
        ['user15', 'mia@example.com', 'Mia Jackson', 'mia'],
        ['user16', 'noah@example.com', 'Noah White', 'noah'],
        ['user17', 'olivia@example.com', 'Olivia Harris', 'olivia'],
        ['user18', 'peter@example.com', 'Peter Martin', 'peter'],
        ['user19', 'quinn@example.com', 'Quinn Lee', 'quinn'],
        ['user20', 'rachel@example.com', 'Rachel Clark', 'rachel'],
        ['current_user', 'user@example.com', 'You', 'user'],
      ];

      const now = Date.now();
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO users (id, email, display_name, username, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      let seededCount = 0;
      demoUsers.forEach(user => {
        const result = stmt.run(user[0], user[1], user[2], user[3], 'demo_hash', now, now);
        if (result.changes > 0) {
          seededCount++;
          console.log(`[USERS] Seeded demo user: ${user[2]}`);
        }
      });

      console.log(`[USERS] Demo user seeding completed. ${seededCount} new users added.`);
      
      return {
        success: true,
        seeded: seededCount
      };
    } catch (error) {
      console.error('[USERS] Failed to seed demo users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if user exists by display name
   */
  userExistsByDisplayName(displayName: string): boolean {
    try {
      const user = this.db.prepare(`
        SELECT id FROM users WHERE display_name = ?
      `).get(displayName);
      
      return !!user;
    } catch (error) {
      console.error('[USERS] Failed to check user existence:', error);
      return false;
    }
  }

  /**
   * Get user by display name
   */
  getUserByDisplayName(displayName: string): any | null {
    try {
      const user = this.db.prepare(`
        SELECT id, email, display_name, username, created_at, updated_at
        FROM users WHERE display_name = ?
      `).get(displayName);
      
      return user || null;
    } catch (error) {
      console.error('[USERS] Failed to get user by display name:', error);
      return null;
    }
  }
}
