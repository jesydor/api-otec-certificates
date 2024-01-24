import { Pool, PoolClient } from 'pg';

export class PostgreSQLDatabase {
  private static instance: PostgreSQLDatabase;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
        user: process.env.PGUSER || 'otec',
        host: process.env.PGHOST || '104.155.167.197',
        database: process.env.PGDATABASE || 'portal-otec',
        password: process.env.PGPASSWORD || 'sistemaotec',
        port: parseInt(process.env.PGPORT || '5432'),
    });
  }

  public static getInstance(): PostgreSQLDatabase {
    if (!PostgreSQLDatabase.instance) {
      PostgreSQLDatabase.instance = new PostgreSQLDatabase();
    }

    return PostgreSQLDatabase.instance;
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async disconnect(): Promise<void> {
    await this.pool.end();
  }
}