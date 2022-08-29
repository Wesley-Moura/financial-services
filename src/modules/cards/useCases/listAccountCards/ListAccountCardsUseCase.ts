import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { IAccountsRepository } from "../../../accounts/repositories/IAccountsRepository";
import { IAccountCardsResponseDTO } from "../../dtos/IAccountCardsResponseDTO";
import { ListAccountCardsMap } from "../../mapper/ListAccountCardsMap";
import { ICardsRepository } from "../../repositories/ICardsRepository";

interface IRequest {
  accountId: string;
}

@injectable()
class ListAccountCardsUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("CardsRepository")
    private cardsRepository: ICardsRepository
  ) {}

  async execute({ accountId }: IRequest): Promise<IAccountCardsResponseDTO> {
    const accountIdValidated = uuidValidator(accountId);

    if (!accountId || accountId.length !== 36 || accountIdValidated === false) {
      throw new AppError("Account id must be uuid format");
    }

    const listAccount = await this.accountsRepository.findById(accountId);

    if (!listAccount) {
      throw new AppError("Account does not exists");
    }

    const listCards = await this.cardsRepository.findByIdAccount(accountId);

    return ListAccountCardsMap.toDTO(listAccount, listCards);
  }
}

export { ListAccountCardsUseCase };
