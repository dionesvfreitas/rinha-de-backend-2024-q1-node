import { DbConnection } from './infra/database';
import { PostgresRepositoryFactory } from './infra/repositories';
import { SaveFinancialTransaction } from './application/useCases';
import {
  FastifyHttpAdapter,
  SaveFinancialTransactionFastifyHttpAdapter,
} from './infra/http';

const connection = DbConnection.getInstance();

const repositoryFactory = new PostgresRepositoryFactory(connection);
const saveFinancialTransaction = new SaveFinancialTransaction(
  repositoryFactory
);
const server = FastifyHttpAdapter.getInstance();
SaveFinancialTransactionFastifyHttpAdapter.register(
  server,
  saveFinancialTransaction
);

server.listen();
