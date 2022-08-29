import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAccountCardsUseCase } from "./ListAccountCardsUseCase";

class ListAccountCardsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { accountId } = request.params;

    const listAccountCardsUseCase = container.resolve(ListAccountCardsUseCase);

    const listCards = await listAccountCardsUseCase.execute({
      accountId,
    });

    return response.status(200).json(listCards);
  }
}

export { ListAccountCardsController };
