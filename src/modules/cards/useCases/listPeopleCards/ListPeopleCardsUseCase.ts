import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { IAccountsRepository } from "../../../accounts/repositories/IAccountsRepository";
import { IPeopleCardsResponseDTO } from "../../dtos/IPeopleCardsResponseDTO";
import { ListPeopleCardsMap } from "../../mapper/ListPeopleCardsMap";
import { ICardsRepository } from "../../repositories/ICardsRepository";

interface IRequest {
  peopleId: string;
  page?: number;
  limit?: number;
}

@injectable()
class ListPeopleCardsUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("CardsRepository")
    private cardsRepository: ICardsRepository
  ) {}

  async execute({
    peopleId,
    page,
    limit,
  }: IRequest): Promise<IPeopleCardsResponseDTO> {
    const peopleIdValidated = uuidValidator(peopleId);

    if (!peopleId || peopleId.length !== 36 || peopleIdValidated === false) {
      throw new AppError("People id must be uuid format");
    }

    const listAccount = await this.accountsRepository.findByPeopleId(peopleId);

    if (listAccount.length <= 0) {
      throw new AppError("There is not exists any account for this people");
    }

    const accountIds = listAccount.map((item) => item.id);

    const listCards = await this.cardsRepository.findByIdAccountPagination(
      accountIds,
      page,
      limit
    );

    return ListPeopleCardsMap.toDTO(listCards, page, limit);
  }
}

export { ListPeopleCardsUseCase };
