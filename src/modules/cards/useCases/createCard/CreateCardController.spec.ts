import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

let peopleId: string;
let accountId: string;

describe("Create card controller", () => {
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
        values('${id}', '001', '2033392-5', '0', '${peopleId}', 'now()', 'now()')
      `
    );

    const account = await PostgresDataSource.query(
      `SELECT * FROM ACCOUNTS WHERE account = '2033392-5'`
    );

    accountId = account[0]?.id;
  });

  afterAll(async () => {
    await PostgresDataSource.dropDatabase();
    await PostgresDataSource.destroy();
  });

  it("Should be able to create a new card", async () => {
    const response = await request(app)
      .post(`/accounts/${accountId}/cards`)
      .send({
        type: "virtual",
        number: "5179 7447 8594 6978",
        cvv: "512",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("type");
    expect(response.body).toHaveProperty("number");
    expect(response.body).toHaveProperty("cvv");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.type).toEqual("virtual");
    expect(response.body.number).toEqual("6978");
    expect(response.body.cvv).toEqual("512");
  });

  it("Should not be able to create a new card if card number is invalid", async () => {
    const response = await request(app)
      .post(`/accounts/${accountId}/cards`)
      .send({
        type: "virtual",
        number: null,
        cvv: "512",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Card number is required and must be a string format"
    );
  });

  it("Should not be able to create a new card if card number format is invalid", async () => {
    const response = await request(app)
      .post(`/accounts/${accountId}/cards`)
      .send({
        type: "virtual",
        number: "5179744785946978",
        cvv: "512",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid card number");
  });

  it("Should not be able to create a new card if cvv is invalid", async () => {
    const response = await request(app)
      .post(`/accounts/${accountId}/cards`)
      .send({
        type: "virtual",
        number: "5179 7447 8594 6978",
        cvv: null,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "cvv number is required, must be a string format and max length is 3 characters"
    );
  });

  it("Should not be able to create a new card if account id is invalid", async () => {
    const response = await request(app).post(`/accounts/${null}/cards`).send({
      type: "virtual",
      number: "5179 7447 8594 6978",
      cvv: "512",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account id must be uuid format");
  });

  it("Should not be able to create a new card if account does not exists in database", async () => {
    const response = await request(app)
      .post(`/accounts/5b4e9570-55fe-48e2-a87b-530920b67642/cards`)
      .send({
        type: "virtual",
        number: "5179 7447 8594 6978",
        cvv: "512",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account does not exists");
  });

  it("Should not be able to create a new card if card already exists in database", async () => {
    const response = await request(app)
      .post(`/accounts/${accountId}/cards`)
      .send({
        type: "virtual",
        number: "5179 7447 8594 6978",
        cvv: "512",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Card already exists");
  });

  it("Should not be able to create a new physical card if already exists a card of type physical", async () => {
    await request(app).post(`/accounts/${accountId}/cards`).send({
      type: "physical",
      number: "9453 4843 4324 1345",
      cvv: "951",
    });

    const response = await request(app)
      .post(`/accounts/${accountId}/cards`)
      .send({
        type: "physical",
        number: "4652 7465 6449 3469",
        cvv: "943",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "There is already a physical card registered"
    );
  });

  it("Should not be able to create a new card if card type is different from virtual or physical", async () => {
    const response = await request(app)
      .post(`/accounts/${accountId}/cards`)
      .send({
        type: "different",
        number: "8431 9557 3564 0423",
        cvv: "231",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Card type must be virtual or physical"
    );
  });
});
