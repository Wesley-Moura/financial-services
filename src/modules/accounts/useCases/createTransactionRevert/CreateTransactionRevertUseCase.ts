import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { ICreateTransactionRevertDTO } from "../../dtos/ICreateTransactionRevertDTO";
import { ITransactionResponseDTO } from "../../dtos/ITransactionResponseDTO";
import { TransactionMap } from "../../mapper/TransactionMap";
import { IAccountsRepository } from "../../repositories/IAccountsRepository";
import { ITransactionsRepository } from "../../repositories/ITransactionsRepository";

@injectable()
class CreateTransactionRevertUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  async execute({
    description,
    id_account,
    transactionId,
  }: ICreateTransactionRevertDTO): Promise<ITransactionResponseDTO> {
    const accountIdValidated = uuidValidator(id_account);
    const transactionIdValidated = uuidValidator(transactionId);

    if (
      !id_account ||
      id_account.length !== 36 ||
      accountIdValidated === false
    ) {
      throw new AppError("Account id must be uuid format");
    }

    if (
      !transactionId ||
      transactionId.length !== 36 ||
      transactionIdValidated === false
    ) {
      throw new AppError("Transaction id must be uuid format");
    }

    const accountExists = await this.accountsRepository.findById(id_account);

    if (!accountExists) {
      throw new AppError("Account does not exists");
    }

    const transactionExists = await this.transactionsRepository.findById(
      transactionId
    );

    if (!transactionExists) {
      throw new AppError("Transaction does not exists");
    }

    let valueUpdated = Number(transactionExists.value);

    if (Number(transactionExists.value) > 0) {
      const balance =
        Number(accountExists.balance) - Number(transactionExists.value);

      if (balance < 0) {
        throw new AppError("insufficient balance in account to revert");
      }
      await this.accountsRepository.updateBalance(id_account, balance);
      valueUpdated = -Number(transactionExists.value);
    } else if (Number(transactionExists.value) < 0) {
      const balance =
        Number(accountExists.balance) + Number(transactionExists.value);

      await this.accountsRepository.updateBalance(id_account, balance);
      valueUpdated = Math.abs(Number(transactionExists.value));
    }

    const transactionRevert = await this.transactionsRepository.create({
      value: valueUpdated,
      description,
      id_account,
    });

    return TransactionMap.toDTO(transactionRevert);
  }
}

export { CreateTransactionRevertUseCase };
