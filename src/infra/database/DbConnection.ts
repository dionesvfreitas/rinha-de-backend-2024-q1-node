import createConnectionPool, { type ConnectionPool } from '@databases/pg';

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_CONNECTION_POOL_SIZE,
} = process.env;
export class DbConnection {
  private static instance: DbConnection;
  private readonly dbInstance: ConnectionPool;
  private constructor() {
    this.dbInstance = createConnectionPool({
      connectionString:
        process.env.DB_CONNECTION_STRING ??
        `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      poolSize: Number(DB_CONNECTION_POOL_SIZE ?? 100),
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
