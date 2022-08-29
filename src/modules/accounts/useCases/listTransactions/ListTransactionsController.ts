import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListTransactionsUseCase } from "./ListTransactionsUseCase";

class ListTransactionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { accountId } = request.params;
    const { page = 1, limit = 5, date } = request.query;

    const listTransactionsUseCase = container.resolve(ListTransactionsUseCase);

    const listTransactions = await listTransactionsUseCase.execute({
      accountId,
      page: page as number,
      limit: limit as number,
      date: date as string,
    });

    return response.status(200).json(listTransactions);
  }
}

export { ListTransactionsController };
