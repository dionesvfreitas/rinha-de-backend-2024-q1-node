import { type BankAccountRepository } from '../../domain/repositories';
import { BankAccount, type FinancialTransaction } from '../../domain/entities';
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

  async incrementBankAccountBalance(
    clientId: number,
    amount: number
  ): Promise<BankAccount | undefined> {
    const response = await this.connection.db.query(
      sql`UPDATE clientes SET saldo = saldo + ${amount} WHERE id = ${clientId} RETURNING id, nome, limite, saldo`
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

  async saveFinancialTransaction(
    financialTransaction: FinancialTransaction
  ): Promise<void> {
    const { clientId, description, type, amount } = financialTransaction;
    void this.connection.db
      .query(
        sql`INSERT INTO transacoes (cliente_id, descricao, tipo, valor, realizada_em) VALUES (${clientId}, ${description}, ${type}, ${amount}, NOW())`
      )
      .then((): void => {});
  }
}
