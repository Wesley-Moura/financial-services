import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransactionsUseCase } from "./CreateTransactionsUseCase";

class CreateTransactionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { value, description } = request.body;
    const { accountId } = request.params;

    const createTransactionsUseCase = container.resolve(
      CreateTransactionsUseCase
    );

    const transaction = await createTransactionsUseCase.execute({
      value,
      description,
      id_account: accountId,
    });

    return response.status(201).json(transaction);
  }
}

export { CreateTransactionsController };
