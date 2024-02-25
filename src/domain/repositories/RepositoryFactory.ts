import { type BankAccountRepository } from './BankAccountRepository';

export interface RepositoryFactory {
  getBankAccountRepository: () => BankAccountRepository;
}
