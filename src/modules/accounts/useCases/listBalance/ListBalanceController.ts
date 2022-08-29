import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListBalanceUseCase } from "./ListBalanceUseCase";

class ListBalanceController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { accountId } = request.params;

    const listBalanceUseCase = container.resolve(ListBalanceUseCase);

    const listBalance = await listBalanceUseCase.execute({ accountId });

    return response.status(200).json(listBalance);
  }
}

export { ListBalanceController };
