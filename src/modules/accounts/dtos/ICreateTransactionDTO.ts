interface ICreateTransactionDTO {
  value: number;
  description: string;
  id_account: string;
  createdAt?: Date;
}

export { ICreateTransactionDTO };
