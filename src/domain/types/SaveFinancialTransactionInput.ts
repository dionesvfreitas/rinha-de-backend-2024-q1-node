import { type FinancialTransactionType } from '../entities';

export interface SaveFinancialTransactionInput {
  clientId: number;
  description: string;
  type: FinancialTransactionType.CREDIT | FinancialTransactionType.DEBIT;
  amount: number;
}
