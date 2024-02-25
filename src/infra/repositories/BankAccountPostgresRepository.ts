import { type BankAccountRepository } from '../../domain/repositories';
import { BankAccount } from '../../domain/entities';
import { type DbConnection } from '../database';
import { sql } from '@databases/pg';

export class BankAccountPostgresRepository implements BankAccountRepository {
  private static instance: BankAccountPostgresRepository;
  private constructor(private readonly connection: DbConnection) {}

  static getInstance(connection: DbConnection): BankAccountPostgresRepository {
    if (BankAccountPostgresRepository.instance === undefined) {
      BankAccountPostgresRepository.instance =
        new BankAccountPostgresRepository(connection);
    }
    return BankAccountPostgresRepository.instance;
  }

  async getBankAccount(clientId: number): Promise<BankAccount | undefined> {
    const response = await this.connection.db.query(
      sql`SELECT id, nome, limite, saldo FROM clientes WHERE id = ${clientId}`
    );
    if (response.length === 0) {
      return undefined;
    }
    const { id, nome, limite, saldo } = response[0];
    return new BankAccount(
      Number(id),
      nome as string,
      Number(limite),
      Number(saldo)
    );
  }
}
