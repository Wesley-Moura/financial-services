import { Repository, In } from "typeorm";

import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { ICreateCardDTO } from "../../../dtos/ICreateCardDTO";
import { ICardsRepository } from "../../../repositories/ICardsRepository";
import { Cards } from "../entities/Cards";

interface IRequest {
  number: string;
  id_account: string;
}

class CardsRepository implements ICardsRepository {
  private repository: Repository<Cards>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Cards);
  }

  async create({
    type,
    number,
    cvv,
    id_account,
  }: ICreateCardDTO): Promise<Cards> {
    const accountResponse = this.repository.create({
      type,
      number,
      cvv,
      id_account,
    });

    await this.repository.save(accountResponse);

    return accountResponse;
  }

  async findByIdAccountAndNumber({
    id_account,
    number,
  }: IRequest): Promise<Cards> {
    const card = await this.repository.findOneBy({ id_account, number });

    return card;
  }

  async findByIdAccount(id_account: string): Promise<Cards[]> {
    const cards = await this.repository.findBy({ id_account });

    return cards;
  }

  async findByIdAccountPagination(
    accountIds: string[],
    page: number,
    limit: number
  ): Promise<[Cards[], number]> {
    const offSet = (page - 1) * limit;
    const cards = await this.repository.findAndCount({
      where: { id_account: In(accountIds) },
      skip: offSet,
      take: limit,
    });

    return cards;
  }
}

export { CardsRepository };
