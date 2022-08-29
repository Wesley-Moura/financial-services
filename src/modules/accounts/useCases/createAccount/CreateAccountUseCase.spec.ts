import { AppError } from "../../../../shared/errors/AppError";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { ICreateAccountDTO } from "../../dtos/ICreateAccountDTO";
import { AccountsRepositoryInMemory } from "../../repositories/in-memory/AccountsRepositoryInMemory";
import { CreateAccountUseCase } from "./CreateAccountUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let createAccountUseCase: CreateAccountUseCase;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;

describe("Create Account", () => {
  let peopleCreated: Peoples;

  beforeEach(async () => {
    accountsRepositoryInMemory = new AccountsRepositoryInMemory();
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();

    createAccountUseCase = new CreateAccountUseCase(
      accountsRepositoryInMemory,
      peoplesRepositoryInMemory
    );

    const people: ICreatePeopleDTO = {
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: "senhaforte",
    };

    peopleCreated = await peoplesRepositoryInMemory.create(people);
  });

  it("Should be able to create a new account", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "2033392-5",
      peopleId: peopleCreated.id,
    };

    const accountCreated = await createAccountUseCase.execute(accountObject);

    expect(accountCreated).toHaveProperty("id");
    expect(accountCreated).toHaveProperty("branch");
    expect(accountCreated).toHaveProperty("account");
    expect(accountCreated).toHaveProperty("createdAt");
    expect(accountCreated).toHaveProperty("updatedAt");
  });

  it("Should not be able to create a new account if branch is invalid", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "",
      account: "2033392-5",
      peopleId: peopleCreated.id,
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("branch is required and must be a string"));
  });

  it("Should not be able to create a new account if branch is not a string", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: null,
      account: "2033392-5",
      peopleId: peopleCreated.id,
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("branch is required and must be a string"));
  });

  it("Should not be able to create a new account if account is invalid", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "",
      peopleId: peopleCreated.id,
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(
      new AppError("Account is required and must be a string")
    );
  });

  it("Should not be able to create a new account if account is not a string", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: null,
      peopleId: peopleCreated.id,
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(
      new AppError("Account is required and must be a string")
    );
  });

  it("Should not be able to create a new account if account is missing digit", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "2033392",
      peopleId: peopleCreated.id,
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("Missing Digit"));
  });

  it("Should not be able to create a new account if people id is invalid", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "2033392-5",
      peopleId: null,
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("People id must be uuid format"));
  });

  it("Should not be able to create a new account if people id length is different from 36 characters", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "2033392-5",
      peopleId: "07080c4d-3926-421d-912f-2fb441dbf3f",
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("People id must be uuid format"));
  });

  it("Should not be able to create a new account if people id is different from uuid format", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "2033392-5",
      peopleId: "07080c4d-3926-421d-912fA2fb441dbf3f9",
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("People id must be uuid format"));
  });

  it("Should not be able to create a new account if people does not exists in database", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "2033392-5",
      peopleId: "07080c4d-3926-421d-912f-2fb441dbf3f9",
    };

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("People does not exists"));
  });

  it("Should not be able to create a new account if account already exists for this people", async () => {
    const accountObject: ICreateAccountDTO = {
      branch: "001",
      account: "2033392-5",
      peopleId: peopleCreated.id,
    };

    await createAccountUseCase.execute(accountObject);

    expect(async () => {
      await createAccountUseCase.execute(accountObject);
    }).rejects.toEqual(new AppError("Account already exists for this people"));
  });
});
