import { FinancialTransactionType } from './FinancialTransactionType';

export class FinancialTransaction {
  constructor(
    public clientId: number,
    public description: string,
    public type: FinancialTransactionType,
    public amount: number,
    public releaseDate: Date = new Date()
  ) {}

  isValid(): boolean {
    if (
      this.description === null ||
      this.description === '' ||
      this.description.length > 10
    ) {
      return false;
    }

    if (!Number.isInteger(this.amount)) {
      return false;
    }

    return Object.values(FinancialTransactionType).includes(this.type);
  }
}
