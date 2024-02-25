import { type BankAccount } from '../entities';

export interface GetBankAccountOutput {
  statusCode: number;
  bankAccount?: BankAccount;
}
