import { Repository } from "typeorm";

import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { ICreatePeopleDTO } from "../../../dtos/ICreatePeopleDTO";
import { IPeoplesRepository } from "../../../repositories/IPeoplesRepository";
import { Peoples } from "../entities/Peoples";

class PeoplesRepository implements IPeoplesRepository {
  private repository: Repository<Peoples>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(Peoples);
  }

  async create({
    name,
    document,
    password,
  }: ICreatePeopleDTO): Promise<Peoples> {
    const people = this.repository.create({
      name,
      document,
      password,
    });

    await this.repository.save(people);

    return people;
  }

  async findByDocument(document: string): Promise<Peoples> {
    const people = await this.repository.findOneBy({ document });

    return people;
  }

  async findById(id: string): Promise<Peoples> {
    const people = await this.repository.findOneBy({ id });

    return people;
  }
}

export { PeoplesRepository };
