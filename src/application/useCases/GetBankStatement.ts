import {
  type BankAccountRepository,
  type RepositoryFactory,
} from '../../domain/repositories';
import { type GetBankStatementOutput } from '../../domain/types';
import { HttpStatus } from '../../infra/http';
import {
  BankStatement,
  FinancialTransaction,
  type FinancialTransactionType,
} from '../../domain/entities';

export class GetBankStatement {
  private readonly bankAccountRepository: BankAccountRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.bankAccountRepository = repositoryFactory.getBankAccountRepository();
  }

  async execute(clientId: number): Promise<GetBankStatementOutput> {
    const databaseData =
      await this.bankAccountRepository.getBankStatement(clientId);
    if (databaseData === undefined) {
      return { statusCode: HttpStatus.NOT_FOUND };
    }
    const bankStatement = new BankStatement(
      databaseData[0].accountLimit,
      databaseData[0].accountBalance
    );
    for (const transaction of databaseData) {
      const newTransaction = new FinancialTransaction(
        clientId,
        transaction.description,
        transaction.type as FinancialTransactionType,
        transaction.amount,
        transaction.releaseDate
      );

      if (!newTransaction.isValid()) {
        continue;
      }
      bankStatement.addTransaction(newTransaction);
    }
    return {
      statusCode: HttpStatus.OK,
      bankStatement,
    };
  }
}
