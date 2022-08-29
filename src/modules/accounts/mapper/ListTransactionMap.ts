import { instanceToInstance } from "class-transformer";

import { IAccountTransactionsResponseDTO } from "../dtos/IAccountTransactionsResponseDTO";
import { ITransactionResponseDTO } from "../dtos/ITransactionResponseDTO";
import { Transactions } from "../infra/typeorm/entities/Transactions";

class ListTransactionMap {
  static toDTO(
    transactions: [Transactions[], number],
    page: number,
    limit: number
  ): IAccountTransactionsResponseDTO {
    const transactionsArray = transactions[0].map(
      (item): ITransactionResponseDTO => {
        return instanceToInstance({
          id: item.id,
          value: Number(item.value),
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      }
    );

    const listTransactions = instanceToInstance({
      transactions: transactionsArray,
      pagination: {
        itemsPerPage: Number(limit),
        currentPage: Number(page),
      },
    });

    return listTransactions;
  }
}

export { ListTransactionMap };
