import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

let peopleId: string;
let accountId: string;

describe("List Account Cards controller", () => {
  beforeAll(async () => {
    await PostgresDataSource.initialize();
    await PostgresDataSource.runMigrations();

    const id = uuidV4();
    const password = await hash("senhaforte", 8);

    await PostgresDataSource.query(
      `INSERT INTO PEOPLES(id, name, document, password, "createdAt", "updatedAt")
        values('${id}', 'Carolina Rosa Marina Barros', '569.679.155-76', '${password}', 'now()', 'now()')
      `
    );

    const people = await PostgresDataSource.query(
      `SELECT * FROM PEOPLES WHERE document = '569.679.155-76'`
    );

    peopleId = people[0]?.id;

    await PostgresDataSource.query(
      `INSERT INTO ACCOUNTS(id, branch, account, balance, id_people, "createdAt", "updatedAt")
        values('${uuidV4()}', '001', '2033392-5', '0', '${peopleId}', 'now()', 'now()')
      `
    );

    const account = await PostgresDataSource.query(
      `SELECT * FROM ACCOUNTS WHERE account = '2033392-5'`
    );

    accountId = account[0]?.id;

    await PostgresDataSource.query(
      `INSERT INTO CARDS(id, type, number, cvv, id_account, "createdAt", "updatedAt")
        values('${uuidV4()}', 'virtual', '5179 7447 8594 6978', '512', '${accountId}', 'now()', 'now()')
      `
    );

    await PostgresDataSource.query(
      `INSERT INTO CARDS(id, type, number, cvv, id_account, "createdAt", "updatedAt")
        values('${uuidV4()}', 'physical', '9453 4843 4324 1345', '951', '${accountId}', 'now()', 'now()')
      `
    );
  });

  afterAll(async () => {
    await PostgresDataSource.dropDatabase();
    await PostgresDataSource.destroy();
  });

  it("Should be able to list all cards of account", async () => {
    const response = await request(app).get(`/accounts/${accountId}/cards`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("branch");
    expect(response.body).toHaveProperty("account");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.branch).toEqual("001");
    expect(response.body.account).toEqual("2033392-5");

    expect(response.body.cards.length).toBe(2);
    expect(response.body.cards[0]).toHaveProperty("id");
    expect(response.body.cards[0]).toHaveProperty("type");
    expect(response.body.cards[0]).toHaveProperty("number");
    expect(response.body.cards[0]).toHaveProperty("cvv");
    expect(response.body.cards[0]).toHaveProperty("createdAt");
    expect(response.body.cards[0]).toHaveProperty("updatedAt");
    expect(response.body.cards[0].type).toEqual("virtual");
    expect(response.body.cards[0].number).toEqual("6978");
    expect(response.body.cards[0].cvv).toEqual("512");

    expect(response.body.cards[1]).toHaveProperty("id");
    expect(response.body.cards[1]).toHaveProperty("type");
    expect(response.body.cards[1]).toHaveProperty("number");
    expect(response.body.cards[1]).toHaveProperty("cvv");
    expect(response.body.cards[1]).toHaveProperty("createdAt");
    expect(response.body.cards[1]).toHaveProperty("updatedAt");
    expect(response.body.cards[1].type).toEqual("physical");
    expect(response.body.cards[1].number).toEqual("1345");
    expect(response.body.cards[1].cvv).toEqual("951");
  });

  it("Should not be able to list all cards of account if uuid is invalid", async () => {
    const response = await request(app).get(`/accounts/${null}/cards`);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account id must be uuid format");
  });

  it("Should not be able to list all cards of account if uuid is invalid", async () => {
    const response = await request(app).get(
      `/accounts/23243245-d7fc-48bc-b53f-af2a58aaa383/cards`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account does not exists");
  });
});
