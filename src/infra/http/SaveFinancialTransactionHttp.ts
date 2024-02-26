import { type SaveFinancialTransaction } from '../../application/useCases';
import {
  type SaveFinancialTransactionInput,
  type SaveFinancialTransactionOutput,
} from '../../domain/types';

export abstract class SaveFinancialTransactionHttp {
  protected constructor(
    private readonly saveFinancialTransaction: SaveFinancialTransaction
  ) {}

  async execute(
    input: SaveFinancialTransactionInput
  ): Promise<SaveFinancialTransactionOutput> {
    return await this.saveFinancialTransaction.execute(input);
  }
}
