import dayjs from "dayjs";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { uuidValidator } from "../../../../utils/uuidValidator";
import { IAccountTransactionsResponseDTO } from "../../dtos/IAccountTransactionsResponseDTO";
import { ListTransactionMap } from "../../mapper/ListTransactionMap";
import { IAccountsRepository } from "../../repositories/IAccountsRepository";
import { ITransactionsRepository } from "../../repositories/ITransactionsRepository";

interface IRequest {
  accountId: string;
  page?: number;
  limit?: number;
  date?: string;
}

@injectable()
class ListTransactionsUseCase {
  constructor(
    @inject("AccountsRepository")
    private accountsRepository: IAccountsRepository,
    @inject("TransactionsRepository")
    private transactionsRepository: ITransactionsRepository
  ) {}

  async execute({
    accountId,
    page = 1,
    limit = 5,
    date,
  }: IRequest): Promise<IAccountTransactionsResponseDTO> {
    let formatedDate: any;

    if (date) {
      formatedDate = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    } else {
      formatedDate = "";
    }

    const accountIdValidated = uuidValidator(accountId);

    if (!accountId || accountId.length !== 36 || accountIdValidated === false) {
      throw new AppError("Account id must be uuid format");
    }

    const accountExists = await this.accountsRepository.findById(accountId);

    if (!accountExists) {
      throw new AppError("Account does not exists");
    }

    const transactions =
      await this.transactionsRepository.findByIdAccountPagination(
        accountId,
        page,
        limit,
        formatedDate
      );

    return ListTransactionMap.toDTO(transactions, page, limit);
  }
}

export { ListTransactionsUseCase };
