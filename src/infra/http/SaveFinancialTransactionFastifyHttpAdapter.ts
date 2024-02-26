import { type FinancialTransactionType } from '../../domain/entities';
import { SaveFinancialTransactionHttp } from './SaveFinancialTransactionHttp';
import { type SaveFinancialTransaction } from '../../application/useCases';
import { type FastifyHttpAdapter } from './FastifyHttpAdapter';
import { HttpStatus } from './HttpStatus';

export class SaveFinancialTransactionFastifyHttpAdapter extends SaveFinancialTransactionHttp {
  private constructor(saveFinancialTransaction: SaveFinancialTransaction) {
    super(saveFinancialTransaction);
  }

  static register(
    server: FastifyHttpAdapter,
    saveFinancialTransaction: SaveFinancialTransaction
  ): void {
    server.getServer().post<{
      Params: { id: string };
      Body: {
        descricao: string;
        tipo: string;
        valor: number;
      };
    }>('/clientes/:id/transacoes', async (request, reply) => {
      const { accountBalance, accountLimit, statusCode } =
        await new SaveFinancialTransactionFastifyHttpAdapter(
          saveFinancialTransaction
        ).execute({
          clientId: Number(request.params.id),
          description: request.body.descricao,
          type: request.body.tipo as FinancialTransactionType,
          amount: request.body.valor,
        });

      if (statusCode === HttpStatus.OK) {
        void reply.code(statusCode).send({
          saldo: accountBalance,
          limite: accountLimit,
        });
        return;
      }

      void reply.code(statusCode).send();
    });
  }
}
