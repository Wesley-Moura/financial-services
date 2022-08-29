import { ICreateAccountDTO } from "../dtos/ICreateAccountDTO";
import { Accounts } from "../infra/typeorm/entities/Accounts";

interface IRequest {
  id_people: string;
  account: string;
}

interface IAccountsRepository {
  create(data: ICreateAccountDTO): Promise<Accounts>;
  findById(id: string): Promise<Accounts>;
  findByPeopleIdAndAccount(data: IRequest): Promise<Accounts>;
  findByPeopleId(id_people: string): Promise<Accounts[]>;
  updateBalance(id: string, balance: number): Promise<void>;
}

export { IAccountsRepository };
