import { instanceToInstance } from "class-transformer";

import { ICardResponseDTO } from "../dtos/ICardResponseDTO";
import { IPeopleCardsResponseDTO } from "../dtos/IPeopleCardsResponseDTO";
import { Cards } from "../infra/typeorm/entities/Cards";

class ListPeopleCardsMap {
  static toDTO(
    cards: [Cards[], number],
    page: number,
    limit: number
  ): IPeopleCardsResponseDTO {
    const cardsArray = cards[0].map((item): ICardResponseDTO => {
      const numberSplited = item.number.split(" ");
      const lastDigits = numberSplited[numberSplited.length - 1];

      return instanceToInstance({
        id: item.id,
        type: item.type,
        number: lastDigits,
        cvv: item.cvv,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    });

    const peopleCards = instanceToInstance({
      cards: cardsArray,
      pagination: {
        itemsPerPage: Number(limit),
        currentPage: Number(page),
      },
    });

    return peopleCards;
  }
}

export { ListPeopleCardsMap };
