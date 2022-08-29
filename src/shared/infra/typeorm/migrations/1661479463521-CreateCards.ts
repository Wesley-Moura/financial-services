import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCards1661479463521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cards",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "type",
            type: "varchar",
          },
          {
            name: "number",
            type: "varchar",
          },
          {
            name: "cvv",
            type: "varchar",
          },
          {
            name: "id_account",
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
            name: "FKAccountToCard",
            referencedTableName: "accounts",
            referencedColumnNames: ["id"],
            columnNames: ["id_account"],
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("cards");
  }
}
