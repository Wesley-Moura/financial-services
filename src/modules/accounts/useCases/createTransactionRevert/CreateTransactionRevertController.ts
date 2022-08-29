import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransactionRevertUseCase } from "./CreateTransactionRevertUseCase";

class CreateTransactionRevertController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { description } = request.body;
    const { accountId, transactionId } = request.params;

    const createTransactionRevertUseCase = container.resolve(
      CreateTransactionRevertUseCase
    );

    const transaction = await createTransactionRevertUseCase.execute({
      description,
      transactionId,
      id_account: accountId,
    });

    return response.status(201).json(transaction);
  }
}

export { CreateTransactionRevertController };
