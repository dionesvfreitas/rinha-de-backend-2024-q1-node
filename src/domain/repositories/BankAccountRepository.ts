import { type BankAccount, type FinancialTransaction } from '../entities';

export interface BankAccountRepository {
  getBankAccount: (clientId: number) => Promise<BankAccount | undefined>;
  incrementBankAccountBalance: (
    clientId: number,
    amount: number
  ) => Promise<{
    bankAccount: BankAccount | undefined;
    invalidBalance: boolean;
  }>;
  saveFinancialTransaction: (
    financialTransaction: FinancialTransaction
  ) => Promise<void>;
  clear: () => Promise<void>;
}
