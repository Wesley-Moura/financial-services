import { ITransactionResponseDTO } from "./ITransactionResponseDTO";

interface IAccountTransactionsResponseDTO {
  transactions: ITransactionResponseDTO[];
  pagination: {
    itemsPerPage: number;
    currentPage: number;
  };
}

export { IAccountTransactionsResponseDTO };
