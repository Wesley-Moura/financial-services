import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { cardNumberValidator } from "../../../../utils/cardNumberValidator";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { IAccountsRepository } from "../../../accounts/repositories/IAccountsRepository";
import { ICardResponseDTO } from "../../dtos/ICardResponseDTO";
import { ICreateCardDTO } from "../../dtos/ICreateCardDTO";
import { CardMap } from "../../mapper/CardMap";
import { ICardsRepository } from "../../repositories/ICardsRepository";

@injectable()
class CreateCardUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("CardsRepository")
    private cardsRepository: ICardsRepository
  ) {}

  async execute({
    type,
    number,
    cvv,
    id_account,
  }: ICreateCardDTO): Promise<ICardResponseDTO> {
    let errorExists = false;
    const physicalCardQuantityExists: string[] = [];
    if (!number || typeof number !== "string") {
      throw new AppError("Card number is required and must be a string format");
    }

    const cardNumberValidated = cardNumberValidator(number);

    if (!cardNumberValidated) {
      throw new AppError("Invalid card number");
    }

    if (!cvv || typeof cvv !== "string" || cvv.length !== 3) {
      throw new AppError(
        "cvv number is required, must be a string format and max length is 3 characters"
      );
    }

    const accountIdValidated = uuidValidator(id_account);

    if (
      !id_account ||
      id_account.length !== 36 ||
      accountIdValidated === false
    ) {
      throw new AppError("Account id must be uuid format");
    }

    const accountExists = await this.accountsRepository.findById(id_account);

    if (!accountExists) {
      throw new AppError("Account does not exists");
    }

    const cardExists = await this.cardsRepository.findByIdAccount(id_account);

    cardExists.forEach((item) => {
      if (item.number === number) {
        errorExists = true;
      }

      if (item.type === "physical") {
        physicalCardQuantityExists.push(item.type);
      }
    });

    if (errorExists) {
      throw new AppError("Card already exists");
    }

    if (physicalCardQuantityExists.length >= 1 && type === "physical") {
      throw new AppError("There is already a physical card registered");
    }

    if (type === "virtual" || type === "physical") {
      const card = await this.cardsRepository.create({
        type,
        number,
        cvv,
        id_account,
      });

      return CardMap.toDTO(card);
    }
    throw new AppError("Card type must be virtual or physical");
  }
}

export { CreateCardUseCase };
