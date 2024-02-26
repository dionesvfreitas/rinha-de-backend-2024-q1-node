import { DbConnection } from '../../src/infra/database';
import { PostgresRepositoryFactory } from '../../src/infra/repositories';
import { FinancialTransactionType } from '../../src/domain/entities';
import {
  GetBankStatement,
  SaveFinancialTransaction,
} from '../../src/application/useCases';
import { HttpStatus } from '../../src/infra/http';

describe('GetBankStatement', () => {
  it('should get bank statement with less than 10 records', async () => {
    // Arrange
    const connection = DbConnection.getInstance();
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    await repositoryFactory.getBankAccountRepository().clear();
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    const getBankStatement = new GetBankStatement(repositoryFactory);
    const clientId = 1;

    // Act
    const transactions = [
      {
        clientId,
        description: 'Salary',
        type: FinancialTransactionType.CREDIT,
        amount: 150,
      },
      {
        clientId,
        description: 'Rent',
        type: FinancialTransactionType.DEBIT,
        amount: 100,
      },
      {
        clientId,
        description: 'Food',
        type: FinancialTransactionType.DEBIT,
        amount: 50,
      },
    ];

    for await (const transaction of transactions) {
      await saveFinancialTransaction.execute(transaction);
    }
    const getBankStatementOutput = await getBankStatement.execute(clientId);

    // Assert
    expect(getBankStatementOutput.statusCode).toBe(HttpStatus.OK);
    expect(
      getBankStatementOutput.bankStatement?.latestTransactions.length
    ).toBe(transactions.length);
    expect(
      getBankStatementOutput.bankStatement?.latestTransactions[0].amount
    ).toBe(transactions[2].amount);
  });

  it('should get bank statement with 10 records', async () => {
    // Arrange
    const connection = DbConnection.getInstance();
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    await repositoryFactory.getBankAccountRepository().clear();
    const saveFinancialTransaction = new SaveFinancialTransaction(
      repositoryFactory
    );
    const getBankStatement = new GetBankStatement(repositoryFactory);
    const clientId = 1;

    // Act
    const transactions = [
      {
        clientId,
        description: 'Salary',
        type: FinancialTransactionType.CREDIT,
        amount: 150,
      },
      {
        clientId,
        description: 'Rent',
        type: FinancialTransactionType.DEBIT,
        amount: 100,
      },
      {
        clientId,
        description: 'Food',
        type: FinancialTransactionType.DEBIT,
        amount: 50,
      },
      {
        clientId,
        description: 'Salary',
        type: FinancialTransactionType.CREDIT,
        amount: 150,
      },
      {
        clientId,
        description: 'Rent',
        type: FinancialTransactionType.DEBIT,
        amount: 100,
      },
      {
        clientId,
        description: 'Food',
        type: FinancialTransactionType.DEBIT,
        amount: 50,
      },
      {
        clientId,
        description: 'Salary',
        type: FinancialTransactionType.CREDIT,
        amount: 150,
      },
      {
        clientId,
        description: 'Rent',
        type: FinancialTransactionType.DEBIT,
        amount: 100,
      },
      {
        clientId,
        description: 'Food',
        type: FinancialTransactionType.DEBIT,
        amount: 50,
      },
      {
        clientId,
        description: 'Salary',
        type: FinancialTransactionType.CREDIT,
        amount: 150,
      },
    ];

    for await (const transaction of transactions) {
      await saveFinancialTransaction.execute(transaction);
    }
    const getBankStatementOutput = await getBankStatement.execute(clientId);

    // Assert
    expect(getBankStatementOutput.statusCode).toBe(HttpStatus.OK);
    expect(
      getBankStatementOutput.bankStatement?.latestTransactions.length
    ).toBe(10);
    expect(
      getBankStatementOutput.bankStatement?.latestTransactions[2].amount
    ).toBe(transactions[7].amount);
  });

  it('should not get bank statement with invalid client', async () => {
    // Arrange
    const connection = DbConnection.getInstance();
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    await repositoryFactory.getBankAccountRepository().clear();
    const getBankStatement = new GetBankStatement(repositoryFactory);
    const clientId = 100;

    // Act
    const getBankStatementOutput = await getBankStatement.execute(clientId);

    // Assert
    expect(getBankStatementOutput.statusCode).toBe(HttpStatus.NOT_FOUND);
  });
});
