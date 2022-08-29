import { DataSource } from "typeorm";

const PostgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "docker",
  database:
    process.env.NODE_ENV === "test"
      ? "financialservices_test"
      : "financialservices",
  migrations: ["src/shared/infra/typeorm/migrations/*.ts"],
  entities: ["src/modules/**/infra/typeorm/entities/*.ts"],
});

if (process.env.NODE_ENV !== "test") {
  PostgresDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
}

export { PostgresDataSource };
