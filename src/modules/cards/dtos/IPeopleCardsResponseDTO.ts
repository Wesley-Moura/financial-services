import { ICardResponseDTO } from "./ICardResponseDTO";

interface IPeopleCardsResponseDTO {
  cards: ICardResponseDTO[];
  pagination: {
    itemsPerPage: number;
    currentPage: number;
  };
}

export { IPeopleCardsResponseDTO };
