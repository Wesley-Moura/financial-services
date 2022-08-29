import { AppError } from "../../../../shared/errors/AppError";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { ICreateTransactionDTO } from "../../dtos/ICreateTransactionDTO";
import { Accounts } from "../../infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../repositories/in-memory/AccountsRepositoryInMemory";
import { TransactionsRepositoryInMemory } from "../../repositories/in-memory/TransactionsRepositoryInMemory";
import { CreateTransactionsUseCase } from "../createTransactions/CreateTransactionsUseCase";
import { CreateTransactionRevertUseCase } from "./CreateTransactionRevertUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let transactionsRepositoryInMemory: TransactionsRepositoryInMemory;
let createTransactionsUseCase: CreateTransactionsUseCase;
let createTransactionRevertUseCase: CreateTransactionRevertUseCase;

describe("Create Transaction Revert", () => {
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

    createTransactionRevertUseCase = new CreateTransactionRevertUseCase(
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

  it("Should be able to create a new credit transaction revert", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    const transactionCreated = await createTransactionsUseCase.execute(
      transactionObject
    );

    const transactionReverted = await createTransactionRevertUseCase.execute({
      description: "Estorno de cobrança indevida.",
      id_account: accountCreated.id,
      transactionId: transactionCreated.id,
    });

    expect(transactionReverted).toHaveProperty("id");
    expect(transactionReverted).toHaveProperty("value");
    expect(transactionReverted).toHaveProperty("description");
    expect(transactionReverted).toHaveProperty("createdAt");
    expect(transactionReverted).toHaveProperty("updatedAt");
    expect(transactionReverted.value).toBe(-100);
    expect(transactionReverted.description).toEqual(
      "Estorno de cobrança indevida."
    );
  });

  it("Should be able to create a new debit transaction revert", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: -100.0,
      description: "Compra de cimento para estoque",
      id_account: accountCreated.id,
    };

    const transactionCreated = await createTransactionsUseCase.execute(
      transactionObject
    );

    const transactionReverted = await createTransactionRevertUseCase.execute({
      description: "Estorno de cobrança indevida.",
      id_account: accountCreated.id,
      transactionId: transactionCreated.id,
    });

    expect(transactionReverted).toHaveProperty("id");
    expect(transactionReverted).toHaveProperty("value");
    expect(transactionReverted).toHaveProperty("description");
    expect(transactionReverted).toHaveProperty("createdAt");
    expect(transactionReverted).toHaveProperty("updatedAt");
    expect(transactionReverted.value).toBe(100);
    expect(transactionReverted.description).toEqual(
      "Estorno de cobrança indevida."
    );
  });

  it("Should not be able to create a new credit transaction revert if account id is invalid", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    const transactionCreated = await createTransactionsUseCase.execute(
      transactionObject
    );

    const transactionRevertObject = {
      description: "Estorno de cobrança indevida.",
      id_account: "fc5288dcWdb47-4aac-86ebBee00e1b3c5de",
      transactionId: transactionCreated.id,
    };

    expect(async () => {
      await createTransactionRevertUseCase.execute(transactionRevertObject);
    }).rejects.toEqual(new AppError("Account id must be uuid format"));
  });

  it("Should not be able to create a new credit transaction revert if transaction id is invalid", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    await createTransactionsUseCase.execute(transactionObject);

    const transactionRevertObject = {
      description: "Estorno de cobrança indevida.",
      id_account: accountCreated.id,
      transactionId: "fc5288dcWdb47-4aac-86ebBee00e1b3c5de",
    };

    expect(async () => {
      await createTransactionRevertUseCase.execute(transactionRevertObject);
    }).rejects.toEqual(new AppError("Transaction id must be uuid format"));
  });

  it("Should not be able to create a new credit transaction revert if transaction id is invalid", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    const transactionCreated = await createTransactionsUseCase.execute(
      transactionObject
    );

    const transactionRevertObject = {
      description: "Estorno de cobrança indevida.",
      id_account: "fc5288dc-db47-4aac-86eb-ee00e1b3c5de",
      transactionId: transactionCreated.id,
    };

    expect(async () => {
      await createTransactionRevertUseCase.execute(transactionRevertObject);
    }).rejects.toEqual(new AppError("Account does not exists"));
  });

  it("Should not be able to create a new credit transaction revert if transaction id is invalid", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    await createTransactionsUseCase.execute(transactionObject);

    const transactionRevertObject = {
      description: "Estorno de cobrança indevida.",
      id_account: accountCreated.id,
      transactionId: "fc5288dc-db47-4aac-86eb-ee00e1b3c5de",
    };

    expect(async () => {
      await createTransactionRevertUseCase.execute(transactionRevertObject);
    }).rejects.toEqual(new AppError("Transaction does not exists"));
  });

  it("Should not be able to create a new credit transaction revert if have insufficient balance in account", async () => {
    const transactionObject: ICreateTransactionDTO = {
      value: 100.0,
      description: "Venda do cimento para Clodson",
      id_account: accountCreated.id,
    };

    const transactionCreated = await createTransactionsUseCase.execute(
      transactionObject
    );

    await accountsRepositoryInMemory.updateBalance(accountCreated.id, 0);

    const transactionRevertObject = {
      description: "Estorno de cobrança indevida.",
      id_account: accountCreated.id,
      transactionId: transactionCreated.id,
    };

    expect(async () => {
      await createTransactionRevertUseCase.execute(transactionRevertObject);
    }).rejects.toEqual(
      new AppError("insufficient balance in account to revert")
    );
  });
});
