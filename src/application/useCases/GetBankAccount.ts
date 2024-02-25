import {
  type BankAccountRepository,
  type RepositoryFactory,
} from '../../domain/repositories';
import { type GetBankAccountOutput } from '../../domain/types';

export class GetBankAccount {
  private readonly bankAccountRepository: BankAccountRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.bankAccountRepository = repositoryFactory.getBankAccountRepository();
  }

  async execute(clientId: number): Promise<GetBankAccountOutput> {
    const bankAccount =
      await this.bankAccountRepository.getBankAccount(clientId);
    if (bankAccount === undefined) {
      return {
        statusCode: 404,
      };
    }
    return {
      statusCode: 200,
      bankAccount,
    };
  }
}
