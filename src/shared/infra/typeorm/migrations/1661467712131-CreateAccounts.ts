import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccounts1661467712131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "accounts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "branch",
            type: "varchar",
          },
          {
            name: "account",
            type: "varchar",
          },
          {
            name: "balance",
            type: "numeric",
          },
          {
            name: "id_people",
            type: "uuid",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKPeopleToAccount",
            referencedTableName: "peoples",
            referencedColumnNames: ["id"],
            columnNames: ["id_people"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("accounts");
  }
}
