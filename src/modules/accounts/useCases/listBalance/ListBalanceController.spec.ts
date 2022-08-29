import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

let peopleId: string;
let accountId: string;

describe("List Account Balance", () => {
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
  });

  afterAll(async () => {
    await PostgresDataSource.dropDatabase();
    await PostgresDataSource.destroy();
  });

  it("Should be able to list all transactions of account", async () => {
    await request(app).post(`/accounts/${accountId}/transactions`).send({
      value: 100.0,
      description: "Venda do cimento para Clodson",
    });

    const response = await request(app).get(`/accounts/${accountId}/balance`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(100);
  });

  it("Should not be able to list account balance if account id is invalid", async () => {
    const response = await request(app).get(
      `/accounts/18b6e891Wc6ff-46a5-8dffB4fd6c142f805/transactions`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account id must be uuid format");
  });

  it("Should not be able to list account balance if account does not exists", async () => {
    const response = await request(app).get(
      `/accounts/18b6e891-c6ff-46a5-8dff-4fd6c142f805/transactions`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Account does not exists");
  });
});
