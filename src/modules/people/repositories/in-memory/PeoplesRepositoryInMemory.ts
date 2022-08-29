import { ICreatePeopleDTO } from "../../dtos/ICreatePeopleDTO";
import { Peoples } from "../../infra/typeorm/entities/Peoples";
import { IPeoplesRepository } from "../IPeoplesRepository";

class PeoplesRepositoryInMemory implements IPeoplesRepository {
  peoples: Peoples[] = [];

  async create({
    name,
    document,
    password,
  }: ICreatePeopleDTO): Promise<Peoples> {
    const people = new Peoples();

    Object.assign(people, {
      name,
      document,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.peoples.push(people);

    return people;
  }

  async findByDocument(document: string): Promise<Peoples> {
    return this.peoples.find((people) => people.document === document);
  }

  async findById(id: string): Promise<Peoples> {
    return this.peoples.find((people) => people.id === id);
  }
}

export { PeoplesRepositoryInMemory };
