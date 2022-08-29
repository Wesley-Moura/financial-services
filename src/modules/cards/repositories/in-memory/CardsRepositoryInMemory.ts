import { ICreateCardDTO } from "../../dtos/ICreateCardDTO";
import { Cards } from "../../infra/typeorm/entities/Cards";
import { ICardsRepository } from "../ICardsRepository";

interface IRequest {
  number: string;
  id_account: string;
}

class CardsRepositoryInMemory implements ICardsRepository {
  cards: Cards[] = [];

  async create({
    type,
    number,
    cvv,
    id_account,
  }: ICreateCardDTO): Promise<Cards> {
    const card = new Cards();

    Object.assign(card, {
      type,
      number,
      cvv,
      id_account,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.cards.push(card);

    return card;
  }

  async findByIdAccountAndNumber({
    id_account,
    number,
  }: IRequest): Promise<Cards> {
    return this.cards.find(
      (item) => item.id_account === id_account && item.number === number
    );
  }

  async findByIdAccount(id_account: string): Promise<Cards[]> {
    return this.cards.filter((item) => item.id_account === id_account);
  }

  async findByIdAccountPagination(
    accountIds: string[],
    page: number,
    limit: number
  ): Promise<[Cards[], number]> {
    const offSet = (page - 1) * limit;
    const maxItens = offSet + limit;
    const cardsArray = [];

    this.cards.forEach((item) => {
      const cardAccountExists = accountIds.some(
        (accountId) => accountId === item.id_account
      );

      if (cardAccountExists) {
        cardsArray.push(item);
      }
    });

    const cardsResponse = cardsArray.slice(offSet, maxItens);

    return [cardsResponse, limit];
  }
}

export { CardsRepositoryInMemory };
