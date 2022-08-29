import { ICreateAccountDTO } from "../../dtos/ICreateAccountDTO";
import { Accounts } from "../../infra/typeorm/entities/Accounts";
import { IAccountsRepository } from "../IAccountsRepository";

interface IRequest {
  id_people: string;
  account: string;
}

class AccountsRepositoryInMemory implements IAccountsRepository {
  accounts: Accounts[] = [];

  async create({
    branch,
    account,
    peopleId,
  }: ICreateAccountDTO): Promise<Accounts> {
    const accountInstance = new Accounts();

    Object.assign(accountInstance, {
      branch,
      account,
      id_people: peopleId,
      balance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.accounts.push(accountInstance);

    return accountInstance;
  }

  async findByPeopleIdAndAccount({
    id_people,
    account,
  }: IRequest): Promise<Accounts> {
    return this.accounts.find(
      (item) => item.id_people === id_people && item.account === account
    );
  }

  async findById(id: string): Promise<Accounts> {
    return this.accounts.find((item) => item.id === id);
  }

  async findByPeopleId(id_people: string): Promise<Accounts[]> {
    const peoples = this.accounts.filter(
      (item) => item.id_people === id_people
    );

    return peoples;
  }

  async updateBalance(id: string, balance: number): Promise<void> {
    const findIndex = this.accounts.findIndex((item) => item.id === id);
    this.accounts[findIndex].balance = balance;
  }
}

export { AccountsRepositoryInMemory };
