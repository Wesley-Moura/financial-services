import { container } from "tsyringe";

import { AccountsRepository } from "../../modules/accounts/infra/typeorm/repositories/AccountsRepository";
import { TransactionsRepository } from "../../modules/accounts/infra/typeorm/repositories/TransactionsRepository";
import { IAccountsRepository } from "../../modules/accounts/repositories/IAccountsRepository";
import { ITransactionsRepository } from "../../modules/accounts/repositories/ITransactionsRepository";
import { CardsRepository } from "../../modules/cards/infra/typeorm/repositories/CardsRepository";
import { ICardsRepository } from "../../modules/cards/repositories/ICardsRepository";
import { PeoplesRepository } from "../../modules/people/infra/typeorm/repositories/PeoplesRepository";
import { IPeoplesRepository } from "../../modules/people/repositories/IPeoplesRepository";

container.registerSingleton<IPeoplesRepository>(
  "PeoplesRepository",
  PeoplesRepository
);

container.registerSingleton<IAccountsRepository>(
  "AccountsRepository",
  AccountsRepository
);

container.registerSingleton<ICardsRepository>(
  "CardsRepository",
  CardsRepository
);

container.registerSingleton<ITransactionsRepository>(
  "TransactionsRepository",
  TransactionsRepository
);
