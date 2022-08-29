import { instanceToInstance } from "class-transformer";

import { Accounts } from "../infra/typeorm/entities/Accounts";

class BalanceMap {
  static toDTO({ balance }: Accounts): { balance: number } {
    const account = instanceToInstance({ balance: Number(balance) });

    return account;
  }
}

export { BalanceMap };
