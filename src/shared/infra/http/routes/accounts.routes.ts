import { Router } from "express";

import { CreateTransactionRevertController } from "../../../../modules/accounts/useCases/createTransactionRevert/CreateTransactionRevertController";
import { CreateTransactionsController } from "../../../../modules/accounts/useCases/createTransactions/CreateTransactionsController";
import { ListBalanceController } from "../../../../modules/accounts/useCases/listBalance/ListBalanceController";
import { ListTransactionsController } from "../../../../modules/accounts/useCases/listTransactions/ListTransactionsController";
import { CreateCardController } from "../../../../modules/cards/useCases/createCard/CreateCardController";
import { ListAccountCardsController } from "../../../../modules/cards/useCases/listAccountCards/ListAccountCardsController";

const accountsRoutes = Router();

const createCardController = new CreateCardController();
const listAccountCardsController = new ListAccountCardsController();
const createTransactionsController = new CreateTransactionsController();
const listTransactionsController = new ListTransactionsController();
const listBalanceController = new ListBalanceController();
const createTransactionRevertController =
  new CreateTransactionRevertController();

accountsRoutes.post("/:accountId/cards", createCardController.handle);
accountsRoutes.get("/:accountId/cards", listAccountCardsController.handle);
accountsRoutes.post(
  "/:accountId/transactions",
  createTransactionsController.handle
);
accountsRoutes.get(
  "/:accountId/transactions",
  listTransactionsController.handle
);
accountsRoutes.get("/:accountId/balance", listBalanceController.handle);
accountsRoutes.post(
  "/:accountId/transactions/:transactionId/revert",
  createTransactionRevertController.handle
);

export { accountsRoutes };
