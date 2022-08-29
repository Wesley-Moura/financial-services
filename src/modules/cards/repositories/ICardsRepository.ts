import { ICreateCardDTO } from "../dtos/ICreateCardDTO";
import { Cards } from "../infra/typeorm/entities/Cards";

interface IRequest {
  number: string;
  id_account: string;
}

interface ICardsRepository {
  create(data: ICreateCardDTO): Promise<Cards>;
  findByIdAccountAndNumber({ id_account, number }: IRequest): Promise<Cards>;
  findByIdAccount(id_account: string): Promise<Cards[]>;
  findByIdAccountPagination(
    accountIds: string[],
    page: number,
    limit: number
  ): Promise<[Cards[], number]>;
}

export { ICardsRepository };
