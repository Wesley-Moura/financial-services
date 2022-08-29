import request from "supertest";

import { app } from "../../../../shared/infra/http/app";
import { PostgresDataSource } from "../../../../shared/infra/typeorm";

describe("Create people controller", () => {
  beforeAll(async () => {
    await PostgresDataSource.initialize();
    await PostgresDataSource.runMigrations();
  });

  afterAll(async () => {
    await PostgresDataSource.dropDatabase();
    await PostgresDataSource.destroy();
  });

  it("Should be able to create a new people", async () => {
    const response = await request(app).post("/people").send({
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: "senhaforte",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("document");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.name).toEqual("Carolina Rosa Marina Barros");
    expect(response.body.document).toEqual("56967915576");
  });

  it("Should not be able to create a new people if name paremeter is missing", async () => {
    const response = await request(app).post("/people").send({
      name: null,
      document: "569.679.155-76",
      password: "senhaforte",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Name is required");
  });

  it("Should not be able to create a new people if document paremeter is missing", async () => {
    const response = await request(app).post("/people").send({
      name: "Carolina Rosa Marina Barros",
      document: null,
      password: "senhaforte",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Document needs to be a string");
  });

  it("Should not be able to create a new people if password paremeter is missing", async () => {
    const response = await request(app).post("/people").send({
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: null,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Password must contain at least 8 characters"
    );
  });

  it("Should not be able to create a new people if document paremeter is not a valid CPF", async () => {
    const response = await request(app).post("/people").send({
      name: "Carolina Rosa Marina Barros",
      document: "133.445.855-92",
      password: "senhaforte",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Document required to be a valid CPF or CNPJ"
    );
  });

  it("Should not be able to create a new people if document paremeter is not a valid CNPJ", async () => {
    const response = await request(app).post("/people").send({
      name: "Carolina Rosa Marina Barros",
      document: "94.998.164/1509-08",
      password: "senhaforte",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      "Document required to be a valid CPF or CNPJ"
    );
  });

  it("Should not be able to create a new people with existing document", async () => {
    const response = await request(app).post("/people").send({
      name: "Carolina Rosa Marina Barros",
      document: "569.679.155-76",
      password: "senhaforte",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Document already exists");
  });
});
