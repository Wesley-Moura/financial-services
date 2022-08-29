import { ICreatePeopleDTO } from "../dtos/ICreatePeopleDTO";
import { Peoples } from "../infra/typeorm/entities/Peoples";

interface IPeoplesRepository {
  create(data: ICreatePeopleDTO): Promise<Peoples>;
  findByDocument(document: string): Promise<Peoples>;
  findById(id: string): Promise<Peoples>;
}

export { IPeoplesRepository };
