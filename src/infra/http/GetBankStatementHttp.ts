import { type GetBankStatement } from '../../application/useCases';
import { type GetBankStatementOutput } from '../../domain/types';

export abstract class GetBankStatementHttp {
  protected constructor(private readonly getBankStatement: GetBankStatement) {}

  async execute(clientId: number): Promise<GetBankStatementOutput> {
    return await this.getBankStatement.execute(clientId);
  }
}
