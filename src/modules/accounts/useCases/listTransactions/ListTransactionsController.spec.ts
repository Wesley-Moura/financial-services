import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

let peopleId: string;
let accountId: string;

describe("List Transaction controller", () => {
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
      `INSERT INTO TRANSACTIONS(id, value, description, id_account, "createdAt", "updatedAt")
        values('${uuidV4()}', '100', 'Venda do cimento para Clodson', '${accountId}', '2022-08-27 00:00:00', 'now()')
      `
    );

    await PostgresDataSource.query(
      `INSERT INTO TRANSACTIONS(id, value, description, id_account, "createdAt", "updatedAt")
        values('${uuidV4()}', '200', 'Venda do cimento para Clodson', '${accountId}', '2022-08-28 00:00:00', 'now()')
      `
    );

    await PostgresDataSource.query(
      `INSERT INTO TRANSACTIONS(id, value, description, id_account, "createdAt", "updatedAt")
        values('${uuidV4()}', '-100', 'Compra de cimento para estoque', '${accountId}', '2022-08-29 00:00:00', 'now()')
      `
    );
  });

  afterAll(async () => {
    await PostgresDataSource.dropDatabase();
    await PostgresDataSource.destroy();
  });

  it("Should be able to list all transactions of account", async () => {
    const response = await request(app).get(
      `/accounts/${accountId}/transactions`
    );

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("transactions");
    expect(response.body).toHaveProperty("pagination");

    expect(response.body.transactions.length).toBe(3);
    expect(response.body.pagination.itemsPerPage).toBe(5);
    expect(response.body.pagination.currentPage).toBe(1);

    expect(response.body.transactions[0]).toHaveProperty("id");
    expect(response.body.transactions[0]).toHaveProperty("value");
    expect(response.body.transactions[0]).toHaveProperty("description");
    expect(response.body.transactions[0]).toHaveProperty("createdAt");
    expect(response.body.transactions[0]).toHaveProperty("updatedAt");
    expect(response.body.transactions[0].value).toBe(100);
    expect(response.body.transactions[0].description).toEqual(
      "Venda do cimento para Clodson"
    );

    expect(response.body.transactions[1]).toHaveProperty("id");
    expect(response.body.transactions[1]).toHaveProperty("value");
    expect(response.body.transactions[1]).toHaveProperty("description");
    expect(response.body.transactions[1]).toHaveProperty("createdAt");
    expect(response.body.transactions[1]).toHaveProperty("updatedAt");
    expect(response.body.transactions[1].value).toBe(200);
    expect(response.body.transactions[1].description).toEqual(
      "Venda do cimento para Clodson"
    );

    expect(response.body.transactions[2]).toHaveProperty("id");
    expect(response.body.transactions[2]).toHaveProperty("value");
    expect(response.body.transactions[2]).toHaveProperty("description");
    expect(response.body.transactions[2]).toHaveProperty("createdAt");
    expect(response.body.transactions[2]).toHaveProperty("updatedAt");
    expect(response.body.transactions[2].value).toBe(-100);
    expect(response.body.transactions[2].description).toEqual(
      "Compra de cimento para estoque"
    );
  });

  it("Should be able to list all transactions of account with pagination and limit itens per page to 1", async () => {
    const response = await request(app)
      .get(`/accounts/${accountId}/transactions`)
      .query({
        page: 1,
        limit: 1,
      });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("transactions");
    expect(response.body).toHaveProperty("pagination");

    expect(response.body.transactions.length).toBe(1);
    expect(response.body.pagination.itemsPerPage).toBe(1);
    expect(response.body.pagination.currentPage).toBe(1);

    expect(response.body.transactions[0]).toHaveProperty("id");
    expect(response.body.transactions[0]).toHaveProperty("value");
    expect(response.body.transactions[0]).toHaveProperty("description");
    expect(response.body.transactions[0]).toHaveProperty("createdAt");
    expect(response.body.transactions[0]).toHaveProperty("updatedAt");
    expect(response.body.transactions[0].value).toBe(100);
    expect(response.body.transactions[0].description).toEqual(
      "Venda do cimento para Clodson"
    );
  });

  it("Should be able to list all transactions of account filter by date", async () => {
    const response = await request(app)
      .get(`/accounts/${accountId}/transactions`)
      .query({
        date: "2022-08-28",
      });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("transactions");
    expect(response.body).toHaveProperty("pagination");

    expect(response.body.transactions.length).toBe(2);
    expect(response.body.pagination.itemsPerPage).toBe(5);
    expect(response.body.pagination.currentPage).toBe(1);

    expect(response.body.transactions[0]).toHaveProperty("id");
    expect(response.body.transactions[0]).toHaveProperty("value");
    expect(response.body.transactions[0]).toHaveProperty("description");
    expect(response.body.transactions[0]).toHaveProperty("createdAt");
    expect(response.body.transactions[0]).toHaveProperty("updatedAt");
    expect(response.body.transactions[0].value).toBe(200);
    expect(response.body.transactions[0].description).toEqual(
      "Venda do cimento para Clodson"
    );

    expect(response.body.transactions[1]).toHaveProperty("id");
    expect(response.body.transactions[1]).toHaveProperty("value");
    expect(response.body.transactions[1]).toHaveProperty("description");
    expect(response.body.transactions[1]).toHaveProperty("createdAt");
    expect(response.body.transactions[1]).toHaveProperty("updatedAt");
    expect(response.body.transactions[1].value).toBe(-100);
    expect(response.body.transactions[1].description).toEqual(
      "Compra de cimento para estoque"
    );
  });

  it("Should not be able to list all transactions of account if account id is invalid", async () => {
    const response = await request(app).get(`/accounts/${null}/transactions`);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account id must be uuid format");
  });

  it("Should not be able to list all transactions of account if account does not exists", async () => {
    const response = await request(app).get(
      `/accounts/18b6e891-c6ff-46a5-8dff-4fd6c142f805/transactions`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account does not exists");
  });
});
