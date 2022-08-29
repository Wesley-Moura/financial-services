import { AppError } from "../../../../shared/errors/AppError";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { Accounts } from "../../infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../repositories/in-memory/AccountsRepositoryInMemory";
import { ListAccountUseCase } from "./ListAccountUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let listAccountUseCase: ListAccountUseCase;

describe("List Account", () => {
  let peopleCreated: Peoples;
  let accountCreated: Accounts;
  let accountCreated2: Accounts;

  beforeEach(async () => {
    accountsRepositoryInMemory = new AccountsRepositoryInMemory();
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();

    listAccountUseCase = new ListAccountUseCase(
      accountsRepositoryInMemory,
      peoplesRepositoryInMemory
    );

    const people: ICreatePeopleDTO = {
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: "senhaforte",
    };

    peopleCreated = await peoplesRepositoryInMemory.create(people);

    accountCreated = await accountsRepositoryInMemory.create({
      branch: "001",
      account: "2033392-5",
      peopleId: peopleCreated.id,
    });

    accountCreated2 = await accountsRepositoryInMemory.create({
      branch: "002",
      account: "4035498-4",
      peopleId: peopleCreated.id,
    });
  });

  it("Should be able to list all account of people", async () => {
    const peopleId = peopleCreated.id;

    const listAccount = await listAccountUseCase.execute({ peopleId });

    expect(listAccount.length).toBe(2);
    expect(listAccount[0]).toHaveProperty("id");
    expect(listAccount[0]).toHaveProperty("branch");
    expect(listAccount[0]).toHaveProperty("account");
    expect(listAccount[0]).toHaveProperty("createdAt");
    expect(listAccount[0]).toHaveProperty("updatedAt");
    expect(listAccount[0].id).toEqual(accountCreated.id);
    expect(listAccount[0].branch).toEqual(accountCreated.branch);
    expect(listAccount[0].account).toEqual(accountCreated.account);

    expect(listAccount[1]).toHaveProperty("id");
    expect(listAccount[1]).toHaveProperty("branch");
    expect(listAccount[1]).toHaveProperty("account");
    expect(listAccount[1]).toHaveProperty("createdAt");
    expect(listAccount[1]).toHaveProperty("updatedAt");
    expect(listAccount[1].id).toEqual(accountCreated2.id);
    expect(listAccount[1].branch).toEqual(accountCreated2.branch);
    expect(listAccount[1].account).toEqual(accountCreated2.account);
  });

  it("Should not be able to list all account of people if uuid is invalid", async () => {
    const peopleId = null;

    expect(async () => {
      await listAccountUseCase.execute({ peopleId });
    }).rejects.toEqual(new AppError("People id must be uuid format"));
  });

  it("Should not be able to list all account of people if uuid is invalid", async () => {
    const peopleId = "d697e10e-be8b-4c14-8c0d-b1a4b83e9774asda4s564";

    expect(async () => {
      await listAccountUseCase.execute({ peopleId });
    }).rejects.toEqual(new AppError("People id must be uuid format"));
  });

  it("Should not be able to list all account of people if uuid is invalid", async () => {
    const peopleId = "d697e10eAbe8b-4c14-8c0dWb1a4b83e9774";

    expect(async () => {
      await listAccountUseCase.execute({ peopleId });
    }).rejects.toEqual(new AppError("People id must be uuid format"));
  });

  it("Should not be able to list all account of people if people does not exists in database", async () => {
    const peopleId = "d697e10e-be8b-4c14-8c0d-b1a4b83e9774";

    expect(async () => {
      await listAccountUseCase.execute({ peopleId });
    }).rejects.toEqual(new AppError("People does not exists"));
  });
});
