import { type GetBankStatement } from '../../application/useCases';
import { type FastifyHttpAdapter } from './FastifyHttpAdapter';
import { HttpStatus } from './HttpStatus';
import { GetBankStatementHttp } from './GetBankStatementHttp';

export class GetBankStatementFastifyHttpAdapter extends GetBankStatementHttp {
  private constructor(getBankStatement: GetBankStatement) {
    super(getBankStatement);
  }

  static register(
    server: FastifyHttpAdapter,
    getBankStatement: GetBankStatement
  ): void {
    server.getServer().get<{
      Params: { id: string };
    }>('/clientes/:id/extrato', async (request, reply) => {
      const { statusCode, bankStatement } =
        await new GetBankStatementFastifyHttpAdapter(getBankStatement).execute(
          Number(request.params.id)
        );

      if (statusCode === HttpStatus.NOT_FOUND || bankStatement === undefined) {
        void reply.code(statusCode).send();
        return;
      }

      void reply.code(statusCode).send({
        saldo: {
          total: bankStatement.accountBalance,
          data_extrato: new Date(),
          limite: bankStatement.accountLimit,
        },
        ultimas_transacoes: bankStatement.latestTransactions.map(
          (transaction) => ({
            valor: transaction.amount,
            tipo: transaction.type,
            descricao: transaction.description,
            realizada_em: transaction.releaseDate,
          })
        ),
      });
    });
  }
}
