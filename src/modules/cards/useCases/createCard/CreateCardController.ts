import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCardUseCase } from "./CreateCardUseCase";

class CreateCardController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { type, number, cvv } = request.body;
    const { accountId } = request.params;

    const createCardUseCase = container.resolve(CreateCardUseCase);

    const card = await createCardUseCase.execute({
      type,
      number,
      cvv,
      id_account: accountId,
    });

    return response.status(201).json(card);
  }
}

export { CreateCardController };
