import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { ICreateTransactionDTO } from "../../dtos/ICreateTransactionDTO";
import { ITransactionResponseDTO } from "../../dtos/ITransactionResponseDTO";
import { TransactionMap } from "../../mapper/TransactionMap";
import { IAccountsRepository } from "../../repositories/IAccountsRepository";
import { ITransactionsRepository } from "../../repositories/ITransactionsRepository";

@injectable()
class CreateTransactionsUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  async execute({
    value,
    description,
    id_account,
  }: ICreateTransactionDTO): Promise<ITransactionResponseDTO> {
    if (!value || typeof value !== "number") {
      throw new AppError("Value is invalid");
    }

    if (!description || description === "") {
      throw new AppError("Description is invalid");
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

    const balance = Number(accountExists.balance) + value;

    if (balance < 0) {
      throw new AppError("Value greater than balance");
    }

    await this.accountsRepository.updateBalance(id_account, balance);

    const transaction = await this.transactionsRepository.create({
      value,
      description,
      id_account,
    });

    return TransactionMap.toDTO(transaction);
  }
}

export { CreateTransactionsUseCase };
