import { AppError } from "../../../../shared/errors/AppError";
import { ICreatePeopleDTO } from "../../dtos/ICreatePeopleDTO";
import { PeoplesRepositoryInMemory } from "../../repositories/in-memory/PeoplesRepositoryInMemory";
import { CreatePeopleUseCase } from "./CreatePeopleUseCase";

let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let createPeopleUseCase: CreatePeopleUseCase;

describe("Create People", () => {
  beforeEach(() => {
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();
    createPeopleUseCase = new CreatePeopleUseCase(peoplesRepositoryInMemory);
  });

  it("Should be able to create a new people with cpf document", async () => {
    const people: ICreatePeopleDTO = {
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: "senhaforte",
    };

    const peopleCreated = await createPeopleUseCase.execute(people);

    expect(peopleCreated).toHaveProperty("id");
    expect(peopleCreated).toHaveProperty("name");
    expect(peopleCreated).toHaveProperty("document");
    expect(peopleCreated).toHaveProperty("createdAt");
    expect(peopleCreated).toHaveProperty("updatedAt");
  });

  it("Should be able to create a new people with cnpj document", async () => {
    const people: ICreatePeopleDTO = {
      name: "Empresa Cubos Tecnologia",
      document: "46.464.765/0001-83",
      password: "senhaforte",
    };

    const peopleCreated = await createPeopleUseCase.execute(people);

    expect(peopleCreated).toHaveProperty("id");
    expect(peopleCreated).toHaveProperty("name");
    expect(peopleCreated).toHaveProperty("document");
    expect(peopleCreated).toHaveProperty("createdAt");
    expect(peopleCreated).toHaveProperty("updatedAt");
  });

  it("Should not be able to create a new people if name paremeter is missing", async () => {
    const people: ICreatePeopleDTO = {
      name: null,
      document: "569.679.155-76",
      password: "senhaforte",
    };

    expect(async () => {
      await createPeopleUseCase.execute(people);
    }).rejects.toEqual(new AppError("Name is required"));
  });

  it("Should not be able to create a new people if document paremeter is missing", async () => {
    const people: ICreatePeopleDTO = {
      name: "Carolina Rosa Marina Barros",
      document: null,
      password: "senhaforte",
    };

    expect(async () => {
      await createPeopleUseCase.execute(people);
    }).rejects.toEqual(new AppError("Document needs to be a string"));
  });

  it("Should not be able to create a new people if password paremeter is missing", async () => {
    const people: ICreatePeopleDTO = {
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: null,
    };

    expect(async () => {
      await createPeopleUseCase.execute(people);
    }).rejects.toEqual(
      new AppError("Password must contain at least 8 characters")
    );
  });

  it("Should not be able to create a new people if document paremeter is not a valid CPF", async () => {
    const people = {
      name: "Carolina Rosa Marina Barros",
      document: "133.445.855-92",
      password: "senhaforte",
    };

    expect(async () => {
      await createPeopleUseCase.execute(people);
    }).rejects.toEqual(
      new AppError("Document required to be a valid CPF or CNPJ")
    );
  });

  it("Should not be able to create a new people if document paremeter is not a valid CNPJ", async () => {
    const people = {
      name: "Carolina Rosa Marina Barros",
      document: "94.998.164/1509-08",
      password: "senhaforte",
    };

    expect(async () => {
      await createPeopleUseCase.execute(people);
    }).rejects.toEqual(
      new AppError("Document required to be a valid CPF or CNPJ")
    );
  });

  it("Should not be able to create a new people with existing document", async () => {
    const people: ICreatePeopleDTO = {
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: "senhaforte",
    };

    await createPeopleUseCase.execute(people);

    expect(async () => {
      await createPeopleUseCase.execute({
        name: "Carlos da Silva",
        document: "569.679.155-76",
        password: "senhamuitoforte",
      });
    }).rejects.toEqual(new AppError("Document already exists"));
  });
});
