export class BankAccount {
  constructor(
    public readonly clientId: number,
    public readonly name: string,
    public readonly limit: number,
    public readonly balance: number = 0
  ) {}
}
