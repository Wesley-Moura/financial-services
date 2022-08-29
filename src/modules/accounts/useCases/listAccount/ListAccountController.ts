import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAccountUseCase } from "./ListAccountUseCase";

class ListAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { peopleId } = request.params;

    const listAccountUseCase = container.resolve(ListAccountUseCase);

    const listAccountResponse = await listAccountUseCase.execute({
      peopleId,
    });

    return response.status(200).json(listAccountResponse);
  }
}

export { ListAccountController };
