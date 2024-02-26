import { DbConnection } from './infra/database';
import { PostgresRepositoryFactory } from './infra/repositories';
import {
  GetBankStatement,
  SaveFinancialTransaction,
} from './application/useCases';
import {
  FastifyHttpAdapter,
  SaveFinancialTransactionFastifyHttpAdapter,
} from './infra/http';
import { GetBankStatementFastifyHttpAdapter } from './infra/http/GetBankStatementFastifyHttpAdapter';

const connection = DbConnection.getInstance();

const repositoryFactory = new PostgresRepositoryFactory(connection);
const saveFinancialTransaction = new SaveFinancialTransaction(
  repositoryFactory
);
const getBankStatement = new GetBankStatement(repositoryFactory);
const server = FastifyHttpAdapter.getInstance();
SaveFinancialTransactionFastifyHttpAdapter.register(
  server,
  saveFinancialTransaction
);
GetBankStatementFastifyHttpAdapter.register(server, getBankStatement);

server.listen();
