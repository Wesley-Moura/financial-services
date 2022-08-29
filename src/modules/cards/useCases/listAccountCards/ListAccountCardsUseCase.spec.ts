import { AppError } from "../../../../shared/errors/AppError";
import { Accounts } from "../../../accounts/infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../../accounts/repositories/in-memory/AccountsRepositoryInMemory";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { CardsRepositoryInMemory } from "../../repositories/in-memory/CardsRepositoryInMemory";
import { ListAccountCardsUseCase } from "./ListAccountCardsUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let cardsRepositoryInMemory: CardsRepositoryInMemory;
let listAccountCardsUseCase: ListAccountCardsUseCase;

describe("List Account Cards", () => {
  let peopleCreated: Peoples;
  let accountCreated: Accounts;

  beforeEach(async () => {
    accountsRepositoryInMemory = new AccountsRepositoryInMemory();
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();
    cardsRepositoryInMemory = new CardsRepositoryInMemory();

    listAccountCardsUseCase = new ListAccountCardsUseCase(
      accountsRepositoryInMemory,
      cardsRepositoryInMemory
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

    await cardsRepositoryInMemory.create({
      type: "virtual",
      number: "5179 7447 8594 6978",
      cvv: "512",
      id_account: accountCreated.id,
    });

    await cardsRepositoryInMemory.create({
      type: "physical",
      number: "9453 4843 4324 1345",
      cvv: "951",
      id_account: accountCreated.id,
    });
  });

  it("Should be able to list all cards of account", async () => {
    const accountId = accountCreated.id;

    const listAccountCards = await listAccountCardsUseCase.execute({
      accountId,
    });

    expect(listAccountCards).toHaveProperty("id");
    expect(listAccountCards).toHaveProperty("branch");
    expect(listAccountCards).toHaveProperty("account");
    expect(listAccountCards).toHaveProperty("createdAt");
    expect(listAccountCards).toHaveProperty("updatedAt");
    expect(listAccountCards.branch).toEqual("001");
    expect(listAccountCards.account).toEqual("2033392-5");

    expect(listAccountCards.cards.length).toBe(2);
    expect(listAccountCards.cards[0]).toHaveProperty("id");
    expect(listAccountCards.cards[0]).toHaveProperty("type");
    expect(listAccountCards.cards[0]).toHaveProperty("number");
    expect(listAccountCards.cards[0]).toHaveProperty("cvv");
    expect(listAccountCards.cards[0]).toHaveProperty("createdAt");
    expect(listAccountCards.cards[0]).toHaveProperty("updatedAt");
    expect(listAccountCards.cards[0].type).toEqual("virtual");
    expect(listAccountCards.cards[0].number).toEqual("6978");
    expect(listAccountCards.cards[0].cvv).toEqual("512");

    expect(listAccountCards.cards[1]).toHaveProperty("id");
    expect(listAccountCards.cards[1]).toHaveProperty("type");
    expect(listAccountCards.cards[1]).toHaveProperty("number");
    expect(listAccountCards.cards[1]).toHaveProperty("cvv");
    expect(listAccountCards.cards[1]).toHaveProperty("createdAt");
    expect(listAccountCards.cards[1]).toHaveProperty("updatedAt");
    expect(listAccountCards.cards[1].type).toEqual("physical");
    expect(listAccountCards.cards[1].number).toEqual("1345");
    expect(listAccountCards.cards[1].cvv).toEqual("951");
  });

  it("Should not be able to list all cards of account if uuid is invalid", async () => {
    const accountId = null;

    expect(async () => {
      await listAccountCardsUseCase.execute({ accountId });
    }).rejects.toEqual(new AppError("Account id must be uuid format"));
  });

  it("Should not be able to list all cards of account if uuid is invalid", async () => {
    const accountId = "23243245-d7fc-48bc-b53f-af2a58aaa383";

    expect(async () => {
      await listAccountCardsUseCase.execute({ accountId });
    }).rejects.toEqual(new AppError("Account does not exists"));
  });
});
