/**
 * Database transaction management utilities
 */

import Database from 'better-sqlite3';
import path from 'path';
import { logger } from './logger';
import { DatabaseError } from './error-handler';

export interface TransactionContext {
  db: Database.Database;
  isTransaction: boolean;
}

/**
 * Get database connection
 */
function getDatabase(): Database.Database {
  const dbPath = path.join(process.cwd(), 'dingdong.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  return db;
}

/**
 * Execute a function within a database transaction
 * Automatically rolls back on error
 */
export async function withTransaction<T>(
  callback: (db: Database.Database) => T
): Promise<T> {
  const db = getDatabase();
  const startTime = Date.now();

  try {
    // Start transaction
    db.prepare('BEGIN TRANSACTION').run();

    // Execute callback
    const result = callback(db);

    // Commit transaction
    db.prepare('COMMIT').run();

    const duration = Date.now() - startTime;
    logger.debug(`Transaction completed in ${duration}ms`);

    return result;
  } catch (error) {
    try {
      // Attempt rollback
      db.prepare('ROLLBACK').run();
      logger.warn(`Transaction rolled back due to error`, undefined, {
        error: (error as Error).message,
      });
    } catch (rollbackError) {
      logger.error(`Rollback failed`, undefined, rollbackError as Error);
    }

    throw new DatabaseError(
      'Database transaction failed',
      process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    );
  } finally {
    db.close();
  }
}

/**
 * Create a savepoint for nested transaction support
 */
export class SavePoint {
  private db: Database.Database;
  private name: string;
  private isReleased = false;

  constructor(db: Database.Database, name: string) {
    this.db = db;
    this.name = name;
    this.db.prepare(`SAVEPOINT ${name}`).run();
  }

  /**
   * Rollback to savepoint
   */
  rollback(): void {
    if (this.isReleased) {
      throw new Error(`Savepoint ${this.name} already released`);
    }
    this.db.prepare(`ROLLBACK TO ${this.name}`).run();
    this.isReleased = true;
  }

  /**
   * Release savepoint (commit)
   */
  release(): void {
    if (this.isReleased) {
      throw new Error(`Savepoint ${this.name} already released`);
    }
    this.db.prepare(`RELEASE ${this.name}`).run();
    this.isReleased = true;
  }
}

/**
 * Execute multiple related operations as a unit
 */
export class TransactionBuilder {
  private db: Database.Database;
  private operations: Array<() => void> = [];
  private isExecuted = false;

  constructor() {
    this.db = getDatabase();
  }

  /**
   * Add operation to transaction
   */
  addOperation(operation: (db: Database.Database) => void): this {
    if (this.isExecuted) {
      throw new Error('Cannot add operations after transaction execution');
    }
    this.operations.push(() => operation(this.db));
    return this;
  }

  /**
   * Execute all operations in transaction
   */
  async execute(): Promise<void> {
    if (this.isExecuted) {
      throw new Error('Transaction already executed');
    }

    try {
      this.db.prepare('BEGIN TRANSACTION').run();

      for (const operation of this.operations) {
        operation();
      }

      this.db.prepare('COMMIT').run();
      this.isExecuted = true;

      logger.debug(`Transaction batch executed with ${this.operations.length} operations`);
    } catch (error) {
      try {
        this.db.prepare('ROLLBACK').run();
      } catch (rollbackError) {
        logger.error(`Rollback failed`, undefined, rollbackError as Error);
      }

      throw new DatabaseError(
        'Transaction batch failed',
        process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      );
    } finally {
      this.db.close();
    }
  }
}

/**
 * Helper for updating multiple records with validation
 */
export async function updateWithValidation<T>(
  table: string,
  records: Array<{ id: number; data: T }>,
  validate: (data: T) => boolean
): Promise<number> {
  return withTransaction((db) => {
    let updated = 0;

    for (const record of records) {
      // Validate data
      if (!validate(record.data)) {
        throw new DatabaseError(`Invalid data for ${table} record ${record.id}`);
      }

      // Prepare update
      const fields = Object.keys(record.data as any);
      const values = Object.values(record.data as any);
      const setClause = fields.map((f) => `${f} = ?`).join(', ');

      // Execute update
      const stmt = db.prepare(`UPDATE ${table} SET ${setClause}, updated_at = ? WHERE id = ?`);
      const result = stmt.run(...values, new Date().toISOString(), record.id);

      if ((result as any).changes) {
        updated++;
      }
    }

    return updated;
  });
}

/**
 * Helper for deleting related records
 */
export async function deleteWithCascade(
  tables: Array<{
    table: string;
    where: Array<{ column: string; value: any }>;
  }>
): Promise<number> {
  return withTransaction((db) => {
    let totalDeleted = 0;

    for (const tableConfig of tables) {
      const whereClause = tableConfig.where.map((w) => `${w.column} = ?`).join(' AND ');
      const whereValues = tableConfig.where.map((w) => w.value);

      const stmt = db.prepare(`DELETE FROM ${tableConfig.table} WHERE ${whereClause}`);
      const result = stmt.run(...whereValues);

      totalDeleted += (result as any).changes || 0;
    }

    return totalDeleted;
  });
}
