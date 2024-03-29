import { DbConnection } from '../../src/infra/database';
import { PostgresRepositoryFactory } from '../../src/infra/repositories';
import { GetBankAccount } from '../../src/application/useCases';
import { HttpStatus } from '../../src/infra/http';

describe('GetBankAccount', () => {
  let connection: DbConnection;
  beforeAll(() => {
    connection = DbConnection.getInstance();
  });

  afterAll(async () => {
    const connection = DbConnection.getInstance();
    await connection.close();
  });

  it('should get a valid bank account', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const getBankAccount = new GetBankAccount(repositoryFactory);
    const clientId = 1;
    await repositoryFactory.getBankAccountRepository().clear();

    // Act
    const getBankAccountOutput = await getBankAccount.execute(clientId);

    // Assert
    expect(getBankAccountOutput.bankAccount?.clientId).toBe(clientId);
  });

  it('should not get a bank account', async () => {
    // Arrange
    const repositoryFactory = new PostgresRepositoryFactory(connection);
    const getBankAccount = new GetBankAccount(repositoryFactory);
    const clientId = 100;
    await repositoryFactory.getBankAccountRepository().clear();

    // Act
    const getBankAccountOutput = await getBankAccount.execute(clientId);

    // Assert
    expect(getBankAccountOutput.bankAccount).toBeUndefined();
    expect(getBankAccountOutput.statusCode).toBe(HttpStatus.NOT_FOUND);
  });
});
