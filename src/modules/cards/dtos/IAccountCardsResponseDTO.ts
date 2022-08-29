import { ICardResponseDTO } from "./ICardResponseDTO";

interface IAccountCardsResponseDTO {
  id: string;
  branch: string;
  account: string;
  cards: ICardResponseDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export { IAccountCardsResponseDTO };
