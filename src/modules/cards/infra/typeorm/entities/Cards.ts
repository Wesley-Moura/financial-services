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

import { Accounts } from "../../../../accounts/infra/typeorm/entities/Accounts";

@Entity("cards")
class Cards {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  number: string;

  @Column()
  cvv: string;

  @Column()
  id_account: string;

  @ManyToOne(() => Accounts)
  @JoinColumn({ name: "id_account" })
  account: Accounts;

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

export { Cards };
