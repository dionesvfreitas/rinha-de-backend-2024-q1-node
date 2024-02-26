import {
  type BankAccountRepository,
  type RepositoryFactory,
} from '../../domain/repositories';
import {
  FinancialTransaction,
  FinancialTransactionType,
} from '../../domain/entities';
import {
  type SaveFinancialTransactionInput,
  type SaveFinancialTransactionOutput,
} from '../../domain/types';
import { HttpStatus } from '../../infra/http';

export class SaveFinancialTransaction {
  private readonly bankAccountRepository: BankAccountRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.bankAccountRepository = repositoryFactory.getBankAccountRepository();
  }

  async execute(
    input: SaveFinancialTransactionInput
  ): Promise<SaveFinancialTransactionOutput> {
    const transaction = new FinancialTransaction(
      input.clientId,
      input.description,
      input.type,
      input.amount
    );
    if (!transaction.isValid()) {
      return { statusCode: HttpStatus.UNPROCESSABLE_ENTITY };
    }
    const amount =
      transaction.type === FinancialTransactionType.CREDIT
        ? transaction.amount
        : -transaction.amount;
    const newAccountBalance =
      await this.bankAccountRepository.incrementBankAccountBalance(
        input.clientId,
        amount
      );
    if (newAccountBalance.bankAccount === undefined) {
      return { statusCode: HttpStatus.NOT_FOUND };
    }
    if (newAccountBalance.invalidBalance) {
      return { statusCode: HttpStatus.UNPROCESSABLE_ENTITY };
    }
    void this.bankAccountRepository.saveFinancialTransaction(transaction);
    return {
      statusCode: HttpStatus.OK,
      accountBalance: newAccountBalance.bankAccount.balance,
      accountLimit: newAccountBalance.bankAccount.limit,
    };
  }
}
