import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

let peopleId: string;
let accountId: string;

describe("Create Transaction Revert controller", () => {
  beforeEach(async () => {
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

  afterEach(async () => {
    await PostgresDataSource.dropDatabase();
    await PostgresDataSource.destroy();
  });

  it("Should be able to create a new credit transaction revert", async () => {
    const transaction = await request(app)
      .post(`/accounts/${accountId}/transactions`)
      .send({
        value: 100.0,
        description: "Venda do cimento para Clodson",
      });

    const response = await request(app)
      .post(`/accounts/${accountId}/transactions/${transaction.body.id}/revert`)
      .send({
        description: "Estorno de cobrança indevida.",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("value");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.value).toBe(-100);
    expect(response.body.description).toEqual("Estorno de cobrança indevida.");
  });

  it("Should be able to create a new debit transaction revert", async () => {
    await request(app).post(`/accounts/${accountId}/transactions`).send({
      value: 100.0,
      description: "Venda do cimento para Clodson",
    });

    const transaction = await request(app)
      .post(`/accounts/${accountId}/transactions`)
      .send({
        value: -100.0,
        description: "Compra de cimento para estoque",
      });

    const response = await request(app)
      .post(`/accounts/${accountId}/transactions/${transaction.body.id}/revert`)
      .send({
        description: "Estorno de cobrança indevida.",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("value");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.value).toBe(100);
    expect(response.body.description).toEqual("Estorno de cobrança indevida.");
  });

  it("Should not be able to create a new credit transaction revert if account id is invalid", async () => {
    const transaction = await request(app)
      .post(`/accounts/${accountId}/transactions`)
      .send({
        value: 100.0,
        description: "Venda do cimento para Clodson",
      });

    const response = await request(app)
      .post(`/accounts/${null}/transactions/${transaction.body.id}/revert`)
      .send({
        description: "Estorno de cobrança indevida.",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account id must be uuid format");
  });

  it("Should not be able to create a new credit transaction revert if transaction id is invalid", async () => {
    await request(app).post(`/accounts/${accountId}/transactions`).send({
      value: 100.0,
      description: "Venda do cimento para Clodson",
    });

    const response = await request(app)
      .post(`/accounts/${accountId}/transactions/${null}/revert`)
      .send({
        description: "Estorno de cobrança indevida.",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Transaction id must be uuid format");
  });

  it("Should not be able to create a new credit transaction revert if transaction id is invalid", async () => {
    const transaction = await request(app)
      .post(`/accounts/${accountId}/transactions`)
      .send({
        value: 100.0,
        description: "Venda do cimento para Clodson",
      });

    const response = await request(app)
      .post(
        `/accounts/fc5288dc-db47-4aac-86eb-ee00e1b3c5de/transactions/${transaction.body.id}/revert`
      )
      .send({
        description: "Estorno de cobrança indevida.",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account does not exists");
  });

  it("Should not be able to create a new credit transaction revert if transaction id is invalid", async () => {
    await request(app).post(`/accounts/${accountId}/transactions`).send({
      value: 100.0,
      description: "Venda do cimento para Clodson",
    });

    const response = await request(app)
      .post(
        `/accounts/${accountId}/transactions/fc5288dc-db47-4aac-86eb-ee00e1b3c5de/revert`
      )
      .send({
        description: "Estorno de cobrança indevida.",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Transaction does not exists");
  });

  it("Should not be able to create a new credit transaction revert if have insufficient balance in account", async () => {
    const transaction = await request(app)
      .post(`/accounts/${accountId}/transactions`)
      .send({
        value: 100.0,
        description: "Venda do cimento para Clodson",
      });

    await request(app)
      .post(`/accounts/${accountId}/transactions/${transaction.body.id}/revert`)
      .send({
        description: "Estorno de cobrança indevida.",
      });

    const response = await request(app)
      .post(`/accounts/${accountId}/transactions/${transaction.body.id}/revert`)
      .send({
        description: "Estorno de cobrança indevida.",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "insufficient balance in account to revert"
    );
  });
});
