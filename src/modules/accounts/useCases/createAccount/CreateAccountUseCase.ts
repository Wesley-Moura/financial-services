import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { IPeoplesRepository } from "../../../people/repositories/IPeoplesRepository";
import { IAccountResponseDTO } from "../../dtos/IAccountResponseDTO";
import { ICreateAccountDTO } from "../../dtos/ICreateAccountDTO";
import { AccountMap } from "../../mapper/AccountMap";
import { IAccountsRepository } from "../../repositories/IAccountsRepository";

@injectable()
class CreateAccountUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("PeoplesRepository")
    private peoplesRepository: IPeoplesRepository
  ) {}

  async execute({
    branch,
    account,
    peopleId,
  }: ICreateAccountDTO): Promise<IAccountResponseDTO> {
    if (!branch || typeof branch !== "string") {
      throw new AppError("branch is required and must be a string");
    }

    if (!account || typeof account !== "string") {
      throw new AppError("Account is required and must be a string");
    }

    const accountArray = account.split("");

    if (accountArray[account.length - 2] !== "-") {
      throw new AppError("Missing Digit");
    }

    const peopleIdValidated = uuidValidator(peopleId);

    if (!peopleId || peopleId.length !== 36 || peopleIdValidated === false) {
      throw new AppError("People id must be uuid format");
    }

    const peopleExists = await this.peoplesRepository.findById(peopleId);

    if (!peopleExists) {
      throw new AppError("People does not exists");
    }

    const accountPeopleExists =
      await this.accountsRepository.findByPeopleIdAndAccount({
        id_people: peopleId,
        account,
      });

    if (accountPeopleExists) {
      throw new AppError("Account already exists for this people");
    }

    const accountResponse = await this.accountsRepository.create({
      branch,
      account,
      peopleId,
    });

    return AccountMap.toDTO(accountResponse);
  }
}

export { CreateAccountUseCase };
