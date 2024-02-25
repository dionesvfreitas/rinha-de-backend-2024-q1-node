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
  ): Promise<{
    bankAccount: BankAccount | undefined;
    invalidBalance: boolean;
  }> {
    const response = await this.connection.db.query(
      sql`UPDATE clientes current SET saldo = CASE WHEN current.saldo + ${amount} < current.limite * -1 THEN current.saldo ELSE current.saldo + ${amount} END FROM clientes old WHERE current.id = old.id AND current.id = ${clientId} RETURNING old.saldo + ${amount} < old.limite * -1 as invalid_balance, current.id, current.nome, current.limite, current.saldo`
    );
    if (response.length === 0) {
      return {
        bankAccount: undefined,
        invalidBalance: false,
      };
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { id, nome, limite, saldo, invalid_balance } = response[0];
    return {
      bankAccount: new BankAccount(
        Number(id),
        nome as string,
        Number(limite),
        Number(saldo)
      ),
      invalidBalance: invalid_balance as boolean,
    };
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
