import { hash } from "bcrypt";
import { cpf, cnpj } from "cpf-cnpj-validator";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { cnpjFormat } from "../../../../utils/cnpjFormat";
import { cpfFormat } from "../../../../utils/cpfFormat";
import { ICreatePeopleDTO } from "../../dtos/ICreatePeopleDTO";
import { IPeopleResponseDTO } from "../../dtos/IPeopleResponseDTO";
import { PeopleMap } from "../../mapper/PeopleMap";
import { IPeoplesRepository } from "../../repositories/IPeoplesRepository";

@injectable()
class CreatePeopleUseCase {
  constructor(
    @inject("PeoplesRepository")
    private peoplesRepository: IPeoplesRepository
  ) {}

  async execute({
    name,
    document,
    password,
  }: ICreatePeopleDTO): Promise<IPeopleResponseDTO> {
    let formatedDocument = "";

    if (name === "" || typeof name !== "string") {
      throw new AppError("Name is required");
    }

    if (typeof document !== "string") {
      throw new AppError("Document needs to be a string");
    }

    if (!password || password?.toString().length < 8) {
      throw new AppError("Password must contain at least 8 characters");
    }

    const documentStringConverted = document.toString();

    if (cpf.isValid(documentStringConverted)) {
      formatedDocument = cpfFormat(documentStringConverted);
    } else if (cnpj.isValid(documentStringConverted)) {
      formatedDocument = cnpjFormat(documentStringConverted);
    } else {
      throw new AppError("Document required to be a valid CPF or CNPJ");
    }

    const documentAlreadyExists = await this.peoplesRepository.findByDocument(
      formatedDocument
    );

    if (documentAlreadyExists) {
      throw new AppError("Document already exists");
    }

    const passwordHash = await hash(password, 8);

    const people = await this.peoplesRepository.create({
      name,
      document: formatedDocument,
      password: passwordHash,
    });

    return PeopleMap.toDTO(people);
  }
}

export { CreatePeopleUseCase };
