import { instanceToInstance } from "class-transformer";

import { IPeopleResponseDTO } from "../dtos/IPeopleResponseDTO";
import { Peoples } from "../infra/typeorm/entities/Peoples";

class PeopleMap {
  static toDTO({
    id,
    name,
    document,
    createdAt,
    updatedAt,
  }: Peoples): IPeopleResponseDTO {
    const peolpe = instanceToInstance({
      id,
      name,
      document,
      createdAt,
      updatedAt,
    });

    return peolpe;
  }
}

export { PeopleMap };
