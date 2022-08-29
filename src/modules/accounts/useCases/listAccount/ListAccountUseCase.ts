import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { IPeoplesRepository } from "../../../people/repositories/IPeoplesRepository";
import { IAccountResponseDTO } from "../../dtos/IAccountResponseDTO";
import { ListAccountMap } from "../../mapper/ListAccountMap";
import { IAccountsRepository } from "../../repositories/IAccountsRepository";

interface IRequest {
  peopleId: string;
}

@injectable()
class ListAccountUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("PeoplesRepository")
    private peoplesRepository: IPeoplesRepository
  ) {}

  async execute({ peopleId }: IRequest): Promise<IAccountResponseDTO[]> {
    const peopleIdValidated = uuidValidator(peopleId);

    if (!peopleId || peopleId.length !== 36 || peopleIdValidated === false) {
      throw new AppError("People id must be uuid format");
    }

    const peopleExists = await this.peoplesRepository.findById(peopleId);

    if (!peopleExists) {
      throw new AppError("People does not exists");
    }

    const listAccount = await this.accountsRepository.findByPeopleId(peopleId);

    return ListAccountMap.toDTO(listAccount);
  }
}

export { ListAccountUseCase };
