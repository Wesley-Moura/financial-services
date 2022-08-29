import { Repository } from "typeorm";

import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { ICreateAccountDTO } from "../../../dtos/ICreateAccountDTO";
import { IAccountsRepository } from "../../../repositories/IAccountsRepository";
import { Accounts } from "../entities/Accounts";

interface IRequest {
  id_people: string;
  account: string;
}

class AccountsRepository implements IAccountsRepository {
  private repository: Repository<Accounts>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Accounts);
  }

  async create({
    branch,
    account,
    peopleId,
  }: ICreateAccountDTO): Promise<Accounts> {
    const accountResponse = this.repository.create({
      branch,
      account,
      id_people: peopleId,
      balance: 0,
    });

    await this.repository.save(accountResponse);

    return accountResponse;
  }

  async findByPeopleIdAndAccount({
    id_people,
    account,
  }: IRequest): Promise<Accounts> {
    const accountResponse = await this.repository.findOne({
      where: { id_people, account },
    });

    return accountResponse;
  }

  async findByPeopleId(id_people: string): Promise<Accounts[]> {
    const listAccount = await this.repository.find({
      where: { id_people },
    });

    return listAccount;
  }

  async findById(id: string): Promise<Accounts> {
    const account = await this.repository.findOneBy({ id });

    return account;
  }

  async updateBalance(id: string, balance: number): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ balance })
      .where("id = :id")
      .setParameters({ id })
      .execute();
  }
}

export { AccountsRepository };
