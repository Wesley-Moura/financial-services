import { Repository } from "typeorm";

import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { ICreateTransactionDTO } from "../../../dtos/ICreateTransactionDTO";
import { ITransactionsRepository } from "../../../repositories/ITransactionsRepository";
import { Transactions } from "../entities/Transactions";

class TransactionsRepository implements ITransactionsRepository {
  private repository: Repository<Transactions>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Transactions);
  }

  async create({
    value,
    description,
    id_account,
  }: ICreateTransactionDTO): Promise<Transactions> {
    const transaction = this.repository.create({
      value,
      description,
      id_account,
    });

    await this.repository.save(transaction);

    return transaction;
  }

  async findByIdAccountPagination(
    id_account: string,
    page: number,
    limit: number,
    createdAt: string
  ): Promise<[Transactions[], number]> {
    const offSet = (page - 1) * limit;

    const transactionQuery = this.repository
      .createQueryBuilder("tra")
      .take(limit)
      .skip(offSet)
      .where("tra.id_account = :id_account", { id_account });

    if (createdAt) {
      transactionQuery.andWhere("tra.createdAt >= :createdAt", {
        createdAt,
      });
    }

    const transactions = await transactionQuery.getManyAndCount();

    return transactions;
  }

  async findById(id: string): Promise<Transactions> {
    const transaction = await this.repository.findOneBy({ id });

    return transaction;
  }
}

export { TransactionsRepository };
