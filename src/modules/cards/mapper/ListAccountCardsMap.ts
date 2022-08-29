import { instanceToInstance } from "class-transformer";

import { Accounts } from "../../accounts/infra/typeorm/entities/Accounts";
import { ICardResponseDTO } from "../dtos/ICardResponseDTO";
import { Cards } from "../infra/typeorm/entities/Cards";

interface IResponse {
  id: string;
  branch: string;
  account: string;
  cards: ICardResponseDTO[];
  createdAt: Date;
  updatedAt: Date;
}

class ListAccountCardsMap {
  static toDTO(account: Accounts, cards: Cards[]): IResponse {
    const cardsArray = cards.map((item): ICardResponseDTO => {
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

    const accountResponse = instanceToInstance({
      id: account.id,
      branch: account.branch,
      account: account.account,
      cards: cardsArray,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });

    return accountResponse;
  }
}

export { ListAccountCardsMap };
