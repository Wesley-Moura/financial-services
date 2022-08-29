import { instanceToInstance } from "class-transformer";

import { IAccountResponseDTO } from "../dtos/IAccountResponseDTO";
import { Accounts } from "../infra/typeorm/entities/Accounts";

class AccountMap {
  static toDTO({
    id,
    branch,
    account,
    createdAt,
    updatedAt,
  }: Accounts): IAccountResponseDTO {
    const accountResponse = instanceToInstance({
      id,
      branch,
      account,
      createdAt,
      updatedAt,
    });

    return accountResponse;
  }
}

export { AccountMap };
