import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

let peopleId: string;

describe("Create Account controller", () => {
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

  it("Should be able to create a new account", async () => {
    const response = await request(app)
      .post(`/people/${peopleId}/accounts`)
      .send({
        branch: "001",
        account: "2033392-5",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("branch");
    expect(response.body).toHaveProperty("account");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.branch).toEqual("001");
    expect(response.body.account).toEqual("2033392-5");
  });

  it("Should not be able to create a new account if branch is invalid", async () => {
    const response = await request(app)
      .post(`/people/${peopleId}/accounts`)
      .send({
        branch: "",
        account: "2033392-5",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "branch is required and must be a string"
    );
  });

  it("Should not be able to create a new account if branch is not a string", async () => {
    const response = await request(app)
      .post(`/people/${peopleId}/accounts`)
      .send({
        branch: null,
        account: "2033392-5",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "branch is required and must be a string"
    );
  });

  it("Should not be able to create a new account if account is invalid", async () => {
    const response = await request(app)
      .post(`/people/${peopleId}/accounts`)
      .send({
        branch: "001",
        account: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Account is required and must be a string"
    );
  });

  it("Should not be able to create a new account if account is not a string", async () => {
    const response = await request(app)
      .post(`/people/${peopleId}/accounts`)
      .send({
        branch: "001",
        account: null,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Account is required and must be a string"
    );
  });

  it("Should not be able to create a new account if account is missing digit", async () => {
    const response = await request(app)
      .post(`/people/${peopleId}/accounts`)
      .send({
        branch: "001",
        account: "2033392",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Missing Digit");
  });

  it("Should not be able to create a new account if people id is invalid", async () => {
    const response = await request(app).post(`/people/${null}/accounts`).send({
      branch: "001",
      account: "2033392-5",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People id must be uuid format");
  });

  it("Should not be able to create a new account if people id length is different from 36 characters", async () => {
    const response = await request(app)
      .post(`/people/07080c4d-3926-421d-912f-2fb441dbf3f/accounts`)
      .send({
        branch: "001",
        account: "2033392-5",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People id must be uuid format");
  });

  it("Should not be able to create a new account if people id is different from uuid format", async () => {
    const response = await request(app)
      .post(`/people/07080c4d-3926-421d-912fA2fb441dbf3f9/accounts`)
      .send({
        branch: "001",
        account: "2033392-5",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People id must be uuid format");
  });

  it("Should not be able to create a new account if people does not exists in database", async () => {
    const response = await request(app)
      .post(`/people/07080c4d-3926-421d-912f-2fb441dbf3f9/accounts`)
      .send({
        branch: "001",
        account: "2033392-5",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("People does not exists");
  });

  it("Should not be able to create a new account if account already exists for this people", async () => {
    const response = await request(app)
      .post(`/people/${peopleId}/accounts`)
      .send({
        branch: "001",
        account: "2033392-5",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Account already exists for this people"
    );
  });
});
