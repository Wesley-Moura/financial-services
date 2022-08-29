import { ICreateTransactionDTO } from "../dtos/ICreateTransactionDTO";
import { Transactions } from "../infra/typeorm/entities/Transactions";

interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transactions>;
  findByIdAccountPagination(
    id_account: string,
    page: number,
    limit: number,
    createdAt?: string
  ): Promise<[Transactions[], number]>;
  findById(id: string): Promise<Transactions>;
}

export { ITransactionsRepository };
