import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'dingdong.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database connection
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize schema if needed
export function initializeDatabase() {
  try {
    // Create sessions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        legal_sin_or_bn TEXT,
        profile_type TEXT NOT NULL,
        role_id INTEGER NOT NULL,
        role_name TEXT NOT NULL,
        properties TEXT,
        status TEXT NOT NULL,
        token TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL
      );
    `);

    // Create occupants table
    db.exec(`
      CREATE TABLE IF NOT EXISTS occupants (
        occupant_id INTEGER PRIMARY KEY AUTOINCREMENT,
        lease_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        unit_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        relationshipToLeaseholder TEXT NOT NULL,
        registrationDate TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create maintenance_requests table
    db.exec(`
      CREATE TABLE IF NOT EXISTS maintenance_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lease_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        unit_number TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        submittedDate TEXT NOT NULL,
        completedDate TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed initial data if tables are empty
    const occupantCount = db.prepare('SELECT COUNT(*) as count FROM occupants').get() as any;
    if (occupantCount.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO occupants (lease_id, property_id, unit_id, name, email, phone, relationshipToLeaseholder, registrationDate, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(2, 2, 3, 'Alice Chen', 'alice@corporate.com', '416-555-0002', 'Primary Leaseholder', '2024-06-01', 'active');
      stmt.run(2, 2, 3, 'Bob Smith', 'bob@corporate.com', '416-555-0020', 'Co-occupant', '2024-07-15', 'active');
      console.log('✅ Seed data inserted');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

export default db;
