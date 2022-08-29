import { AppError } from "../../../../shared/errors/AppError";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { ICreateTransactionDTO } from "../../dtos/ICreateTransactionDTO";
import { Accounts } from "../../infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../repositories/in-memory/AccountsRepositoryInMemory";
import { TransactionsRepositoryInMemory } from "../../repositories/in-memory/TransactionsRepositoryInMemory";
import { CreateTransactionsUseCase } from "./CreateTransactionsUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let transactionsRepositoryInMemory: TransactionsRepositoryInMemory;
let createTransactionsUseCase: CreateTransactionsUseCase;

describe("Create Transaction", () => {
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

  it("Should be able to create a new credit transaction", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    const transactionCreated = await createTransactionsUseCase.execute(
      transactionObject
    );

    expect(transactionCreated).toHaveProperty("id");
    expect(transactionCreated).toHaveProperty("value");
    expect(transactionCreated).toHaveProperty("description");
    expect(transactionCreated).toHaveProperty("createdAt");
    expect(transactionCreated).toHaveProperty("updatedAt");
    expect(transactionCreated.value).toBe(100);
    expect(transactionCreated.description).toEqual(
      "Venda do cimento para Clodson"
    );
  });

  it("Should be able to create a new debit transaction", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: -100.0,
      description: "Compra de cimento para estoque",
      id_account: accountCreated.id,
    };

    const transactionCreated = await createTransactionsUseCase.execute(
      transactionObject
    );

    expect(transactionCreated).toHaveProperty("id");
    expect(transactionCreated).toHaveProperty("value");
    expect(transactionCreated).toHaveProperty("description");
    expect(transactionCreated).toHaveProperty("createdAt");
    expect(transactionCreated).toHaveProperty("updatedAt");
    expect(transactionCreated.value).toBe(-100);
    expect(transactionCreated.description).toEqual(
      "Compra de cimento para estoque"
    );
  });

  it("Should not be able to create a new credit transaction if value is invalid", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    expect(async () => {
      await createTransactionsUseCase.execute(transactionObject);
    }).rejects.toEqual(new AppError("Value is invalid"));
  });

  it("Should not be able to create a new credit transaction if description is invalid", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "",
      id_account: accountCreated.id,
    };

    expect(async () => {
      await createTransactionsUseCase.execute(transactionObject);
    }).rejects.toEqual(new AppError("Description is invalid"));
  });

  it("Should not be able to create a new credit transaction if account id is invalid", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: "18b6e891Bc6ff-46a5-8dffW4fd6c142f805",
    };

    expect(async () => {
      await createTransactionsUseCase.execute(transactionObject);
    }).rejects.toEqual(new AppError("Account id must be uuid format"));
  });

  it("Should not be able to create a new credit transaction if account does not exists", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: "18b6e891-c6ff-46a5-8dff-4fd6c142f805",
    };

    expect(async () => {
      await createTransactionsUseCase.execute(transactionObject);
    }).rejects.toEqual(new AppError("Account does not exists"));
  });

  it("Should not be able to create a new debit transaction if value is greater than account balance", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: -200.0,
      description: "Compra de cimento para estoque",
      id_account: accountCreated.id,
    };

    expect(async () => {
      await createTransactionsUseCase.execute(transactionObject);
    }).rejects.toEqual(new AppError("Value greater than balance"));
  });
});
