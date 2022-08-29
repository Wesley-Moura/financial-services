import { AppError } from "../../../../shared/errors/AppError";
import { Accounts } from "../../../accounts/infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../../accounts/repositories/in-memory/AccountsRepositoryInMemory";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { CardsRepositoryInMemory } from "../../repositories/in-memory/CardsRepositoryInMemory";
import { ListPeopleCardsUseCase } from "./ListPeopleCardsUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let cardsRepositoryInMemory: CardsRepositoryInMemory;
let listPeopleCardsUseCase: ListPeopleCardsUseCase;

describe("List People Cards", () => {
  let peopleCreated: Peoples;
  let accountCreated: Accounts;

  beforeEach(async () => {
    accountsRepositoryInMemory = new AccountsRepositoryInMemory();
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();
    cardsRepositoryInMemory = new CardsRepositoryInMemory();

    listPeopleCardsUseCase = new ListPeopleCardsUseCase(
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

  it("Should be able to list all cards of people", async () => {
    const peopleId = peopleCreated.id;

    const listPeopleCards = await listPeopleCardsUseCase.execute({
      peopleId,
      page: 1,
      limit: 5,
    });

    expect(listPeopleCards).toHaveProperty("cards");
    expect(listPeopleCards).toHaveProperty("pagination");
    expect(listPeopleCards.pagination).toHaveProperty("itemsPerPage");
    expect(listPeopleCards.pagination).toHaveProperty("currentPage");

    expect(listPeopleCards.cards.length).toBe(2);
    expect(listPeopleCards.cards[0]).toHaveProperty("id");
    expect(listPeopleCards.cards[0]).toHaveProperty("type");
    expect(listPeopleCards.cards[0]).toHaveProperty("number");
    expect(listPeopleCards.cards[0]).toHaveProperty("cvv");
    expect(listPeopleCards.cards[0]).toHaveProperty("createdAt");
    expect(listPeopleCards.cards[0]).toHaveProperty("updatedAt");
    expect(listPeopleCards.cards[0].type).toEqual("virtual");
    expect(listPeopleCards.cards[0].number).toEqual("6978");
    expect(listPeopleCards.cards[0].cvv).toEqual("512");

    expect(listPeopleCards.cards[1]).toHaveProperty("id");
    expect(listPeopleCards.cards[1]).toHaveProperty("type");
    expect(listPeopleCards.cards[1]).toHaveProperty("number");
    expect(listPeopleCards.cards[1]).toHaveProperty("cvv");
    expect(listPeopleCards.cards[1]).toHaveProperty("createdAt");
    expect(listPeopleCards.cards[1]).toHaveProperty("updatedAt");
    expect(listPeopleCards.cards[1].type).toEqual("physical");
    expect(listPeopleCards.cards[1].number).toEqual("1345");
    expect(listPeopleCards.cards[1].cvv).toEqual("951");
  });

  it("Should not be able to list all cards of people if people id is invalid", async () => {
    const peopleId = null;

    expect(async () => {
      await listPeopleCardsUseCase.execute({
        peopleId,
        page: 1,
        limit: 5,
      });
    }).rejects.toEqual(new AppError("People id must be uuid format"));
  });

  it("Should not be able to list all cards of people if people does not have an account", async () => {
    const people: ICreatePeopleDTO = {
      name: "Carlos Silva",
      document: "383.978.430-19",
      password: "senhaforte",
    };

    const newPeople = await peoplesRepositoryInMemory.create(people);

    expect(async () => {
      await listPeopleCardsUseCase.execute({
        peopleId: newPeople.id,
        page: 1,
        limit: 5,
      });
    }).rejects.toEqual(
      new AppError("There is not exists any account for this people")
    );
  });
});
