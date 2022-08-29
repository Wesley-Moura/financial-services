import dayjs from "dayjs";

import { ICreateTransactionDTO } from "../../dtos/ICreateTransactionDTO";
import { Transactions } from "../../infra/typeorm/entities/Transactions";
import { ITransactionsRepository } from "../ITransactionsRepository";

class TransactionsRepositoryInMemory implements ITransactionsRepository {
  transactions: Transactions[] = [];

  async create({
    value,
    description,
    id_account,
    createdAt,
  }: ICreateTransactionDTO): Promise<Transactions> {
    const transaction = new Transactions();

    Object.assign(transaction, {
      value,
      description,
      id_account,
      createdAt,
      updatedAt: new Date(),
    });

    this.transactions.push(transaction);

    return transaction;
  }

  async findByIdAccountPagination(
    id_account: string,
    page: number,
    limit: number,
    createdAt?: string
  ): Promise<[Transactions[], number]> {
    const offSet = (page - 1) * limit;
    const maxItens = offSet + limit;

    let transactionsArray = [];

    if (!createdAt) {
      transactionsArray = this.transactions.filter(
        (item) => item.id_account === id_account
      );
    } else {
      transactionsArray = this.transactions.filter((item) => {
        const year = createdAt.split("-")[0];
        const month = createdAt.split("-")[1];
        const day = createdAt.split("-")[2].split(" ")[0];

        const createdAtFormatted = new Date(
          Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0)
        );
        let DateIsTrue = false;

        if (
          dayjs(item.createdAt).isSame(createdAtFormatted) === true ||
          dayjs(item.createdAt).isAfter(createdAtFormatted) === true
        ) {
          DateIsTrue = true;
        }

        return item.id_account === id_account && DateIsTrue;
      });
    }

    const transactionsResponse = transactionsArray.slice(offSet, maxItens);

    return [transactionsResponse, limit];
  }

  async findById(id: string): Promise<Transactions> {
    return this.transactions.find((item) => item.id === id);
  }
}

export { TransactionsRepositoryInMemory };
