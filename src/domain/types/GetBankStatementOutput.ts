import { type BankStatement } from '../entities';
export interface GetBankStatementOutput {
  statusCode: number;
  bankStatement?: BankStatement;
}

export interface GetBankStatementDbOutput {
  accountBalance: number;
  accountLimit: number;
  description: string;
  amount: number;
  type: string;
  releaseDate: Date;
}
