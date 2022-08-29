import { instanceToInstance } from "class-transformer";

import { ITransactionResponseDTO } from "../dtos/ITransactionResponseDTO";
import { Transactions } from "../infra/typeorm/entities/Transactions";

class TransactionMap {
  static toDTO({
    id,
    value,
    description,
    createdAt,
    updatedAt,
  }: Transactions): ITransactionResponseDTO {
    const transaction = instanceToInstance({
      id,
      value: Number(value),
      description,
      createdAt,
      updatedAt,
    });

    return transaction;
  }
}

export { TransactionMap };
