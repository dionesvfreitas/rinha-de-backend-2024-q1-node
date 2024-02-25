import { DbConnection } from '../../src/infra/database';
import { PostgresRepositoryFactory } from '../../src/infra/repositories';
import { GetBankAccount } from '../../src/application/useCases';

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

    // Act
    const getBankAccountOutput = await getBankAccount.execute(clientId);

    // Assert
    expect(getBankAccountOutput.bankAccount).toBeUndefined();
    expect(getBankAccountOutput.statusCode).toBe(404);
  });
});
