import { AppError } from "../../../../shared/errors/AppError";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { Accounts } from "../../infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../repositories/in-memory/AccountsRepositoryInMemory";
import { TransactionsRepositoryInMemory } from "../../repositories/in-memory/TransactionsRepositoryInMemory";
import { ListTransactionsUseCase } from "./ListTransactionsUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let transactionsRepositoryInMemory: TransactionsRepositoryInMemory;
let listTransactionsUseCase: ListTransactionsUseCase;

describe("List Transactions", () => {
  let peopleCreated: Peoples;
  let accountCreated: Accounts;

  beforeEach(async () => {
    accountsRepositoryInMemory = new AccountsRepositoryInMemory();
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();
    transactionsRepositoryInMemory = new TransactionsRepositoryInMemory();

    listTransactionsUseCase = new ListTransactionsUseCase(
      accountsRepositoryInMemory,
      transactionsRepositoryInMemory
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

    await transactionsRepositoryInMemory.create({
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
      createdAt: new Date("2022-08-27"),
    });

    await transactionsRepositoryInMemory.create({
      value: 200.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
      createdAt: new Date("2022-08-28"),
    });

    await transactionsRepositoryInMemory.create({
      value: -100.0,
      description: "Compra de cimento para estoque",
      id_account: accountCreated.id,
      createdAt: new Date(),
    });
  });

  it("Should be able to list all transactions of account", async () => {
    const listAccountTransactions = await listTransactionsUseCase.execute({
      accountId: accountCreated.id,
    });

    expect(listAccountTransactions).toHaveProperty("transactions");
    expect(listAccountTransactions).toHaveProperty("pagination");

    expect(listAccountTransactions.transactions.length).toBe(3);
    expect(listAccountTransactions.pagination.itemsPerPage).toBe(5);
    expect(listAccountTransactions.pagination.currentPage).toBe(1);

    expect(listAccountTransactions.transactions[0]).toHaveProperty("id");
    expect(listAccountTransactions.transactions[0]).toHaveProperty("value");
    expect(listAccountTransactions.transactions[0]).toHaveProperty(
      "description"
    );
    expect(listAccountTransactions.transactions[0]).toHaveProperty("createdAt");
    expect(listAccountTransactions.transactions[0]).toHaveProperty("updatedAt");
    expect(listAccountTransactions.transactions[0].value).toBe(100);
    expect(listAccountTransactions.transactions[0].description).toEqual(
      "Venda do cimento para Clodson"
    );

    expect(listAccountTransactions.transactions[1]).toHaveProperty("id");
    expect(listAccountTransactions.transactions[1]).toHaveProperty("value");
    expect(listAccountTransactions.transactions[1]).toHaveProperty(
      "description"
    );
    expect(listAccountTransactions.transactions[1]).toHaveProperty("createdAt");
    expect(listAccountTransactions.transactions[1]).toHaveProperty("updatedAt");
    expect(listAccountTransactions.transactions[1].value).toBe(200);
    expect(listAccountTransactions.transactions[1].description).toEqual(
      "Venda do cimento para Clodson"
    );

    expect(listAccountTransactions.transactions[2]).toHaveProperty("id");
    expect(listAccountTransactions.transactions[2]).toHaveProperty("value");
    expect(listAccountTransactions.transactions[2]).toHaveProperty(
      "description"
    );
    expect(listAccountTransactions.transactions[2]).toHaveProperty("createdAt");
    expect(listAccountTransactions.transactions[2]).toHaveProperty("updatedAt");
    expect(listAccountTransactions.transactions[2].value).toBe(-100);
    expect(listAccountTransactions.transactions[2].description).toEqual(
      "Compra de cimento para estoque"
    );
  });

  it("Should be able to list all transactions of account with pagination and limit itens per page to 1", async () => {
    const listAccountTransactions = await listTransactionsUseCase.execute({
      accountId: accountCreated.id,
      page: 1,
      limit: 1,
    });

    expect(listAccountTransactions).toHaveProperty("transactions");
    expect(listAccountTransactions).toHaveProperty("pagination");

    expect(listAccountTransactions.transactions.length).toBe(1);
    expect(listAccountTransactions.pagination.itemsPerPage).toBe(1);
    expect(listAccountTransactions.pagination.currentPage).toBe(1);

    expect(listAccountTransactions.transactions[0]).toHaveProperty("id");
    expect(listAccountTransactions.transactions[0]).toHaveProperty("value");
    expect(listAccountTransactions.transactions[0]).toHaveProperty(
      "description"
    );
    expect(listAccountTransactions.transactions[0]).toHaveProperty("createdAt");
    expect(listAccountTransactions.transactions[0]).toHaveProperty("updatedAt");
    expect(listAccountTransactions.transactions[0].value).toBe(100);
    expect(listAccountTransactions.transactions[0].description).toEqual(
      "Venda do cimento para Clodson"
    );
  });

  it("Should be able to list all transactions of account filter by date", async () => {
    const listAccountTransactions = await listTransactionsUseCase.execute({
      accountId: accountCreated.id,
      date: "2022-08-28",
    });

    expect(listAccountTransactions).toHaveProperty("transactions");
    expect(listAccountTransactions).toHaveProperty("pagination");

    expect(listAccountTransactions.transactions.length).toBe(2);
    expect(listAccountTransactions.pagination.itemsPerPage).toBe(5);
    expect(listAccountTransactions.pagination.currentPage).toBe(1);

    expect(listAccountTransactions.transactions[0]).toHaveProperty("id");
    expect(listAccountTransactions.transactions[0]).toHaveProperty("value");
    expect(listAccountTransactions.transactions[0]).toHaveProperty(
      "description"
    );
    expect(listAccountTransactions.transactions[0]).toHaveProperty("createdAt");
    expect(listAccountTransactions.transactions[0]).toHaveProperty("updatedAt");
    expect(listAccountTransactions.transactions[0].value).toBe(200);
    expect(listAccountTransactions.transactions[0].description).toEqual(
      "Venda do cimento para Clodson"
    );

    expect(listAccountTransactions.transactions[1]).toHaveProperty("id");
    expect(listAccountTransactions.transactions[1]).toHaveProperty("value");
    expect(listAccountTransactions.transactions[1]).toHaveProperty(
      "description"
    );
    expect(listAccountTransactions.transactions[1]).toHaveProperty("createdAt");
    expect(listAccountTransactions.transactions[1]).toHaveProperty("updatedAt");
    expect(listAccountTransactions.transactions[1].value).toBe(-100);
    expect(listAccountTransactions.transactions[1].description).toEqual(
      "Compra de cimento para estoque"
    );
  });

  it("Should not be able to list all transactions of account if account id is invalid", async () => {
    expect(async () => {
      await listTransactionsUseCase.execute({ accountId: null });
    }).rejects.toEqual(new AppError("Account id must be uuid format"));
  });

  it("Should not be able to list all transactions of account if account does not exists", async () => {
    expect(async () => {
      await listTransactionsUseCase.execute({
        accountId: "18b6e891-c6ff-46a5-8dff-4fd6c142f805",
      });
    }).rejects.toEqual(new AppError("Account does not exists"));
  });
});
