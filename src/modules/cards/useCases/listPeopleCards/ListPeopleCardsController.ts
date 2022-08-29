import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListPeopleCardsUseCase } from "./ListPeopleCardsUseCase";

class ListPeopleCardsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { peopleId } = request.params;
    const { page = 1, limit = 5 } = request.query;

    const listPeopleCardsUseCase = container.resolve(ListPeopleCardsUseCase);

    const listPeopleCards = await listPeopleCardsUseCase.execute({
      peopleId,
      page: page as number,
      limit: limit as number,
    });

    return response.status(200).json(listPeopleCards);
  }
}

export { ListPeopleCardsController };
