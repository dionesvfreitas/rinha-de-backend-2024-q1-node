import {
  FinancialTransaction,
  FinancialTransactionType
} from '../../src/domain/entities';

describe('FinancialTransaction', () => {
  it('should be able to create a valid instance', () => {
    const clientId = 1;
    const amount = 100;
    const description = 'COD.: 1';
    const transaction = new FinancialTransaction(
      clientId,
      description,
      FinancialTransactionType.CREDIT,
      amount
    );

    expect(transaction.isValid()).toBeTruthy();
    expect(transaction.clientId).toBe(clientId);
    expect(transaction.amount).toBe(amount);
    expect(transaction.description).toBe(description);
    expect(transaction.type).toBe(FinancialTransactionType.CREDIT);
  });

  it('should not be able to create an instance with invalid description', () => {
    const clientId = 1;
    const amount = 100;
    const description = 'COD.: 1 - 1234567890';
    const transaction = new FinancialTransaction(
      clientId,
      description,
      FinancialTransactionType.CREDIT,
      amount
    );

    expect(transaction.isValid()).toBeFalsy();
  });

  it('should not be able to create an instance with invalid amount', () => {
    const clientId = 1;
    const amount = 100.1;
    const description = 'COD.: 1';
    const transaction = new FinancialTransaction(
      clientId,
      description,
      FinancialTransactionType.CREDIT,
      amount
    );

    expect(transaction.isValid()).toBeFalsy();
  });
});
