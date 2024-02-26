import {
  type BankAccountRepository,
  type RepositoryFactory,
} from '../../domain/repositories';
import { type GetBankAccountOutput } from '../../domain/types';
import { HttpStatus } from '../../infra/http';

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
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
    return {
      statusCode: HttpStatus.OK,
      bankAccount,
    };
  }
}
