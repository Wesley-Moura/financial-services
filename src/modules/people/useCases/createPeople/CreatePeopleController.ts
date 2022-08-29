import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePeopleUseCase } from "./CreatePeopleUseCase";

class CreatePeopleController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, document, password } = request.body;

    const createPeopleUseCase = container.resolve(CreatePeopleUseCase);

    const people = await createPeopleUseCase.execute({
      name,
      document,
      password,
    });

    return response.status(201).json(people);
  }
}

export { CreatePeopleController };
