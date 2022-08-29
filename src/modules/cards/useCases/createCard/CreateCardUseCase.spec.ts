import { AppError } from "../../../../shared/errors/AppError";
import { Accounts } from "../../../accounts/infra/typeorm/entities/Accounts";
import { AccountsRepositoryInMemory } from "../../../accounts/repositories/in-memory/AccountsRepositoryInMemory";
import { ICreatePeopleDTO } from "../../../people/dtos/ICreatePeopleDTO";
import { Peoples } from "../../../people/infra/typeorm/entities/Peoples";
import { PeoplesRepositoryInMemory } from "../../../people/repositories/in-memory/PeoplesRepositoryInMemory";
import { ICreateCardDTO } from "../../dtos/ICreateCardDTO";
import { CardsRepositoryInMemory } from "../../repositories/in-memory/CardsRepositoryInMemory";
import { CreateCardUseCase } from "./CreateCardUseCase";

let accountsRepositoryInMemory: AccountsRepositoryInMemory;
let peoplesRepositoryInMemory: PeoplesRepositoryInMemory;
let cardsRepositoryInMemory: CardsRepositoryInMemory;
let createCardUseCase: CreateCardUseCase;

describe("Create card", () => {
  let peopleCreated: Peoples;
  let accountCreated: Accounts;

  beforeEach(async () => {
    accountsRepositoryInMemory = new AccountsRepositoryInMemory();
    peoplesRepositoryInMemory = new PeoplesRepositoryInMemory();
    cardsRepositoryInMemory = new CardsRepositoryInMemory();

    createCardUseCase = new CreateCardUseCase(
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
  });

  it("Should be able to create a new card", async () => {
    const cardObject: ICreateCardDTO = {
      type: "virtual",
      number: "5179 7447 8594 6978",
      cvv: "512",
      id_account: accountCreated.id,
    };

    const cardCreated = await createCardUseCase.execute(cardObject);

    expect(cardCreated).toHaveProperty("id");
    expect(cardCreated).toHaveProperty("type");
    expect(cardCreated).toHaveProperty("number");
    expect(cardCreated).toHaveProperty("cvv");
    expect(cardCreated).toHaveProperty("createdAt");
    expect(cardCreated).toHaveProperty("updatedAt");
  });

  it("Should not be able to create a new card if card number is invalid", async () => {
    const cardObject: ICreateCardDTO = {
      type: "virtual",
      number: null,
      cvv: "512",
      id_account: accountCreated.id,
    };

    expect(async () => {
      await createCardUseCase.execute(cardObject);
    }).rejects.toEqual(
      new AppError("Card number is required and must be a string format")
    );
  });

  it("Should not be able to create a new card if card number format is invalid", async () => {
    const cardObject: ICreateCardDTO = {
      type: "virtual",
      number: "5179744785946978",
      cvv: "512",
      id_account: accountCreated.id,
    };

    expect(async () => {
      await createCardUseCase.execute(cardObject);
    }).rejects.toEqual(new AppError("Invalid card number"));
  });

  it("Should not be able to create a new card if cvv is invalid", async () => {
    const cardObject: ICreateCardDTO = {
      type: "virtual",
      number: "5179 7447 8594 6978",
      cvv: null,
      id_account: accountCreated.id,
    };

    expect(async () => {
      await createCardUseCase.execute(cardObject);
    }).rejects.toEqual(
      new AppError(
        "cvv number is required, must be a string format and max length is 3 characters"
      )
    );
  });

  it("Should not be able to create a new card if account id is invalid", async () => {
    const cardObject: ICreateCardDTO = {
      type: "virtual",
      number: "5179 7447 8594 6978",
      cvv: "512",
      id_account: null,
    };

    expect(async () => {
      await createCardUseCase.execute(cardObject);
    }).rejects.toEqual(new AppError("Account id must be uuid format"));
  });

  it("Should not be able to create a new card if account does not exists in database", async () => {
    const cardObject: ICreateCardDTO = {
      type: "virtual",
      number: "5179 7447 8594 6978",
      cvv: "512",
      id_account: "5b4e9570-55fe-48e2-a87b-530920b67642",
    };

    expect(async () => {
      await createCardUseCase.execute(cardObject);
    }).rejects.toEqual(new AppError("Account does not exists"));
  });

  it("Should not be able to create a new card if card already exists in database", async () => {
    const cardObject: ICreateCardDTO = {
      type: "virtual",
      number: "5179 7447 8594 6978",
      cvv: "512",
      id_account: accountCreated.id,
    };

    await createCardUseCase.execute(cardObject);

    expect(async () => {
      await createCardUseCase.execute(cardObject);
    }).rejects.toEqual(new AppError("Card already exists"));
  });

  it("Should not be able to create a new physical card if already exists a card of type physical", async () => {
    const cardObject: ICreateCardDTO = {
      type: "physical",
      number: "5179 7447 8594 6978",
      cvv: "512",
      id_account: accountCreated.id,
    };

    await createCardUseCase.execute(cardObject);

    expect(async () => {
      await createCardUseCase.execute({
        type: "physical",
        number: "9453 4843 4324 1345",
        cvv: "951",
        id_account: accountCreated.id,
      });
    }).rejects.toEqual(
      new AppError("There is already a physical card registered")
    );
  });

  it("Should not be able to create a new card if card type is different from virtual or physical", async () => {
    const cardObject: ICreateCardDTO = {
      type: "different",
      number: "5179 7447 8594 6978",
      cvv: "512",
      id_account: accountCreated.id,
    };

    expect(async () => {
      await createCardUseCase.execute(cardObject);
    }).rejects.toEqual(new AppError("Card type must be virtual or physical"));
  });
});
