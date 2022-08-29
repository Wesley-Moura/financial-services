import { AppError } from "../../../../shared/errors/AppError";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { Accounts } from "../../infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../repositories/in-memory/AccountsRepositoryInMemory";
import { TransactionsRepositoryInMemory } from "../../repositories/in-memory/TransactionsRepositoryInMemory";
import { CreateTransactionsUseCase } from "../createTransactions/CreateTransactionsUseCase";
import { ListBalanceUseCase } from "./ListBalanceUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let transactionsRepositoryInMemory: TransactionsRepositoryInMemory;
let createTransactionsUseCase: CreateTransactionsUseCase;
let listBalanceUseCase: ListBalanceUseCase;

describe("List Account Balance", () => {
  let peopleCreated: Peoples;
  let accountCreated: Accounts;

  beforeEach(async () => {
    accountsRepositoryInMemory = new AccountsRepositoryInMemory();
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();
    transactionsRepositoryInMemory = new TransactionsRepositoryInMemory();

    createTransactionsUseCase = new CreateTransactionsUseCase(
      accountsRepositoryInMemory,
      transactionsRepositoryInMemory
    );

    listBalanceUseCase = new ListBalanceUseCase(accountsRepositoryInMemory);

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
  });

  it("Should be able to list account balance", async () => {
    await createTransactionsUseCase.execute({
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    });

    const listAccountBalance = await listBalanceUseCase.execute({
      accountId: accountCreated.id,
    });

    expect(listAccountBalance).toHaveProperty("balance");
    expect(listAccountBalance.balance).toBe(200);
  });

  it("Should not be able to list account balance if account id is invalid", async () => {
    expect(async () => {
      await listBalanceUseCase.execute({
        accountId: "18b6e891Wc6ff-46a5-8dffB4fd6c142f805",
      });
    }).rejects.toEqual(new AppError("Account id must be uuid format"));
  });

  it("Should not be able to list account balance if account does not exists", async () => {
    expect(async () => {
      await listBalanceUseCase.execute({
        accountId: "18b6e891-c6ff-46a5-8dff-4fd6c142f805",
      });
    }).rejects.toEqual(new AppError("Account does not exists"));
  });
});
