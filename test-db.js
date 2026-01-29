// Simple test to verify database population
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'chats.db');
console.log('Testing database at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Check if chats table exists
  const tableInfo = db.prepare(`
    SELECT sql FROM sqlite_master 
    WHERE type='table' AND name='chats'
  `).get();
  
  if (tableInfo) {
    console.log('✅ Chats table exists');
    
    // Count chats
    const chatCount = db.prepare('SELECT COUNT(*) as count FROM chats').get();
    console.log(`📊 Found ${chatCount.count} chats`);
    
    // Count users
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    console.log(`👥 Found ${userCount.count} users`);
    
    // Count messages
    const messageCount = db.prepare('SELECT COUNT(*) as count FROM messages').get();
    console.log(`💬 Found ${messageCount.count} messages`);
    
    // Show sample chats
    const sampleChats = db.prepare('SELECT id, name, type FROM chats LIMIT 5').all();
    console.log('\n📋 Sample chats:');
    sampleChats.forEach(chat => {
      console.log(`  - ${chat.name} (${chat.type})`);
    });
    
  } else {
    console.log('❌ Chats table does not exist');
  }
  
  db.close();
} catch (error) {
  console.error('❌ Database error:', error.message);
}
