import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { Peoples } from "../../../../people/infra/typeorm/entities/Peoples";

@Entity("accounts")
class Accounts {
  @PrimaryColumn()
  id: string;

  @Column()
  branch: string;

  @Column()
  account: string;

  @Column()
  balance: number;

  @Column()
  id_people: string;

  @ManyToOne(() => Peoples)
  @JoinColumn({ name: "id_people" })
  people: Peoples;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Accounts };
