import {
  type BankAccountRepository,
  type RepositoryFactory,
} from '../../domain/repositories';
import { BankAccountPostgresRepository } from './BankAccountPostgresRepository';
import { type DbConnection } from '../database';

export class PostgresRepositoryFactory implements RepositoryFactory {
  constructor(private readonly connection: DbConnection) {}
  getBankAccountRepository(): BankAccountRepository {
    return BankAccountPostgresRepository.getInstance(this.connection);
  }
}
