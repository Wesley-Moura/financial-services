interface ICreateCardDTO {
  type: string;
  number: string;
  cvv: string;
  id_account?: string;
}

export { ICreateCardDTO };
