import { instanceToInstance } from "class-transformer";

import { IAccountResponseDTO } from "../dtos/IAccountResponseDTO";
import { Accounts } from "../infra/typeorm/entities/Accounts";

class ListAccountMap {
  static toDTO(accounts: Accounts[]): IAccountResponseDTO[] {
    const accountResponse = accounts.map((item) =>
      instanceToInstance({
        id: item.id,
        branch: item.branch,
        account: item.account,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })
    );

    return accountResponse;
  }
}

export { ListAccountMap };
