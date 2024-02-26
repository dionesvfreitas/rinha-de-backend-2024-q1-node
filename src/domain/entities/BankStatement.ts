import { type FinancialTransaction } from './FinancialTransaction';

export class BankStatement {
  public releaseDate: Date;
  public latestTransactions: FinancialTransaction[] = [];
  constructor(
    public accountLimit: number,
    public accountBalance: number
  ) {
    this.releaseDate = new Date();
  }

  addTransaction(transaction: FinancialTransaction): void {
    this.latestTransactions.push(transaction);
  }
}
