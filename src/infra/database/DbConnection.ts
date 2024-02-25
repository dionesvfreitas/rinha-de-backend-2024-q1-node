import createConnectionPool, { type ConnectionPool } from '@databases/pg';

export class DbConnection {
  private static instance: DbConnection;
  private readonly dbInstance: ConnectionPool;
  private constructor() {
    this.dbInstance = createConnectionPool({
      connectionString:
        process.env.DB_CONNECTION_STRING ??
        'postgres://rinha:rinha@localhost:5432/rinha',
      poolSize: 100,
      bigIntMode: 'number',
    });
  }

  static getInstance(): DbConnection {
    if (DbConnection.instance === undefined) {
      DbConnection.instance = new DbConnection();
    }
    return DbConnection.instance;
  }

  get db(): ConnectionPool {
    return this.dbInstance;
  }

  async close(): Promise<void> {
    await this.dbInstance.dispose();
  }
}
