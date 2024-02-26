import fastify, { type FastifyInstance } from 'fastify';
export class FastifyHttpAdapter {
  private readonly server: FastifyInstance;
  private static instance: FastifyHttpAdapter;
  constructor() {
    this.server = fastify();
  }
  static getInstance(): FastifyHttpAdapter {
    if (FastifyHttpAdapter.instance === undefined) {
      FastifyHttpAdapter.instance = new FastifyHttpAdapter();
    }
    return FastifyHttpAdapter.instance;
  }
  getServer(): FastifyInstance {
    return this.server;
  }
  listen(port: number = 8080, host: string = '0.0.0.0'): void {
    this.server.listen({ port, host }, (err, address) => {
      if (err !== null) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
}
