import { FinancialTransactionType } from '../../src/domain/entities';
import { PostgresRepositoryFactory } from '../../src/infra/repositories';
import {
  SaveFinancialTransaction,
  GetBankAccount,
} from '../../src/application/useCases';
import { DbConnection } from '../../src/infra/database';
import { HttpStatus } from '../../src/infra/http';

describe('SaveFinancialTransaction', () => {
  let connection: DbConnection;
  beforeAll(() => {
    connection = DbConnection.getInstance();
  });

  afterAll(async () => {
    const connection = DbConnection.getInstance();
    await connection.close();
  });

  it('should save a valid credit financial transaction', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    await repositoryFactory.getBankAccountRepository().clear();
    const getClientBankAccount = new GetBankAccount(repositoryFactory);
    const clientId = 1;
    const getBankAccountOutput = await getClientBankAccount.execute(clientId);
    const accountBalance = getBankAccountOutput.bankAccount?.balance ?? 0;
    const amount = 150;
    const description = 'Salary';

    // Act
    const { accountBalance: accountBalanceOutput } =
      await saveFinancialTransaction.execute({
        clientId,
        description,
        type: FinancialTransactionType.CREDIT,
        amount,
      });

    // Assert
    expect(accountBalanceOutput).toBe(accountBalance + amount);
  });

  it('should save a valid debit financial transaction', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    await repositoryFactory.getBankAccountRepository().clear();
    const getClientBankAccount = new GetBankAccount(repositoryFactory);
    const clientId = 1;
    const getBankAccountOutput = await getClientBankAccount.execute(clientId);
    const accountBalance = getBankAccountOutput.bankAccount?.balance ?? 0;
    const amount = 100;
    const description = 'Salary';

    // Act
    const { accountBalance: accountBalanceOutput, statusCode } =
      await saveFinancialTransaction.execute({
        clientId,
        description,
        type: FinancialTransactionType.DEBIT,
        amount,
      });

    // Assert
    expect(accountBalanceOutput).toBe(accountBalance - amount);
    expect(statusCode).toBe(HttpStatus.OK);
  });

  it('should not save an financial transaction with invalid amount format', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    await repositoryFactory.getBankAccountRepository().clear();
    const clientId = 1;
    const amount = 2.5;
    const description = 'Salary';

    // Act
    const { statusCode } = await saveFinancialTransaction.execute({
      clientId,
      description,
      type: FinancialTransactionType.DEBIT,
      amount,
    });

    // Assert
    expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should not save an financial transaction with invalid type', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    await repositoryFactory.getBankAccountRepository().clear();
    const clientId = 1;
    const amount = 100;
    const description = 'Salary';

    // Act
    const { statusCode } = await saveFinancialTransaction.execute({
      clientId,
      description,
      type: 'invalid' as FinancialTransactionType,
      amount,
    });

    // Assert
    expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should not save an financial transaction with invalid client', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    await repositoryFactory.getBankAccountRepository().clear();
    const clientId = 100;
    const amount = 100;
    const description = 'Salary';

    // Act
    const { statusCode } = await saveFinancialTransaction.execute({
      clientId,
      description,
      type: FinancialTransactionType.CREDIT,
      amount,
    });

    // Assert
    expect(statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('should not save an financial transaction with invalid balance', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    await repositoryFactory.getBankAccountRepository().clear();
    const clientId = 1;
    const amount = 120000;
    const description = 'Salary';

    // Act
    const { statusCode } = await saveFinancialTransaction.execute({
      clientId,
      description,
      type: FinancialTransactionType.DEBIT,
      amount,
    });

    // Assert
    expect(statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
  });
});
