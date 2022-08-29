import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

let peopleId: string;

describe("List Account controller", () => {
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
  });

  afterAll(async () => {
    await PostgresDataSource.dropDatabase();
    await PostgresDataSource.destroy();
  });

  it("Should be able to list all account of people", async () => {
    await request(app).post(`/people/${peopleId}/accounts`).send({
      branch: "001",
      account: "2033392-5",
    });

    await request(app).post(`/people/${peopleId}/accounts`).send({
      branch: "002",
      account: "4035498-4",
    });

    const response = await request(app).get(`/people/${peopleId}/accounts`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("branch");
    expect(response.body[0]).toHaveProperty("account");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("updatedAt");
    expect(response.body[0].branch).toEqual("001");
    expect(response.body[0].account).toEqual("2033392-5");

    expect(response.body[1]).toHaveProperty("id");
    expect(response.body[1]).toHaveProperty("branch");
    expect(response.body[1]).toHaveProperty("account");
    expect(response.body[1]).toHaveProperty("createdAt");
    expect(response.body[1]).toHaveProperty("updatedAt");
    expect(response.body[1].branch).toEqual("002");
    expect(response.body[1].account).toEqual("4035498-4");
  });

  it("Should not be able to list all account of people if uuid is invalid", async () => {
    const response = await request(app).get(`/people/${null}/accounts`);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People id must be uuid format");
  });

  it("Should not be able to list all account of people if uuid is invalid", async () => {
    const response = await request(app).get(
      `/people/d697e10e-be8b-4c14-8c0d-b1a4b83e9774asda4s564/accounts`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People id must be uuid format");
  });

  it("Should not be able to list all account of people if uuid is invalid", async () => {
    const response = await request(app).get(
      `/people/d697e10eAbe8b-4c14-8c0dWb1a4b83e9774/accounts`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People id must be uuid format");
  });

  it("Should not be able to list all account of people if people does not exists in database", async () => {
    const response = await request(app).get(
      `/people/d697e10e-be8b-4c14-8c0d-b1a4b83e9774/accounts`
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People does not exists");
  });
});
