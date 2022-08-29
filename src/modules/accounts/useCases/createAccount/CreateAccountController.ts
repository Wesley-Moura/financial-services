import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateAccountUseCase } from "./CreateAccountUseCase";

class CreateAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { branch, account } = request.body;
    const { peopleId } = request.params;

    const createAccountUseCase = container.resolve(CreateAccountUseCase);

    const accountResponse = await createAccountUseCase.execute({
      branch,
      account,
      peopleId,
    });

    return response.status(201).json(accountResponse);
  }
}

export { CreateAccountController };
