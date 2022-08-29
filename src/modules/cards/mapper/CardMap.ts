import { instanceToInstance } from "class-transformer";

import { ICardResponseDTO } from "../dtos/ICardResponseDTO";
import { Cards } from "../infra/typeorm/entities/Cards";

class CardMap {
  static toDTO({
    id,
    type,
    number,
    cvv,
    createdAt,
    updatedAt,
  }: Cards): ICardResponseDTO {
    const numberSplited = number.split(" ");
    const lastDigits = numberSplited[numberSplited.length - 1];

    const card = instanceToInstance({
      id,
      type,
      number: lastDigits,
      cvv,
      createdAt,
      updatedAt,
    });

    return card;
  }
}

export { CardMap };
