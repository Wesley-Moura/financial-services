import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { BalanceMap } from "../../mapper/BalanceMap";
import { IAccountsRepository } from "../../repositories/IAccountsRepository";

interface IRequest {
  accountId: string;
}

@injectable()
class ListBalanceUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository
  ) {}

  async execute({ accountId }: IRequest): Promise<{ balance: number }> {
    const accountIdValidated = uuidValidator(accountId);

    if (!accountId || accountId.length !== 36 || accountIdValidated === false) {
      throw new AppError("Account id must be uuid format");
    }

    const account = await this.accountsRepository.findById(accountId);

    if (!account) {
      throw new AppError("Account does not exists");
    }

    return BalanceMap.toDTO(account);
  }
}

export { ListBalanceUseCase };
